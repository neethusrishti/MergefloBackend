const mongoose = require("mongoose");
const async = require("async");
var crypto = require('crypto');
const nodemailer = require('nodemailer');
const usersModel = require("../model/users"); //users model
const businessAccountsModel = require("../model/businessaccounts"); //business account model
const dealspaceModel =  require("../model/dealspaces"); //dealspace model
const authentication = require('../../config/auth');
const emailCredential = require('../../config/config');
const { gmail: { host, pass } } = emailCredential;
const auth = new authentication;

// ******User Signup ConfirmEmail******
const signupConfirmEmail = async(req, res, msg) => {  
  usersModel
  .findOne({ 'email': req.body.email })
  .then((user) => {
    if(user){
      res.json({
        message: "Email already exist",
        status: false
      }); 

    } else {
      let user = new usersModel({   
        email: req.body.email
      });
      user.save()
        .then((response) => {
          async.waterfall([
            function (done) {
              crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
              });
            },
            function (token, done) {
              usersModel.findOne({ '_id': response._id }, function (err, vuser) {
                vuser.emailVerifyToken = token;  
                vuser.save(function (err) {
                  done(err, token, vuser);
                });
              });
            },
            function (token, vuser, done) {
               //email start
              var transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                  user: host,
                  pass: pass
                }
              });
          
              var mailOptions = {
                from: 'support@mergeflow.com',
                to: req.body.email,
                subject: 'MergeFlow - Email Verification',
                html: '<p><b style="font-size:20px; font-weight:900;">Welcome to MergeFlow</b></p><p>You have successfully created an account.Please click on the activation link below to activate your account.</p><p>' +
                  '<a href="http://13.234.177.61/emailverify?verifytoken=' + token + '">Activate Account</a></p><p>' +
                  'Please do not respond to this message. </p>'
              };
          
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  res.json({
                  message: error,
                  status: false
                  });
                } else {
                  res.json({  
                  status:true,
                  message: 'Thank You for registering! Please check your email to activate your account.',
                  data: response
                  })
                }
              });
              //email end
            }
          ], function (err) {
            if (err)
              return next(err);
            res.json({
              status: false,
              message: 'Retry'
            });
          });     
        })
        .catch((error) => {
          res.json({
            message: error,
            status: false
          });
        }); 
    }
  })
  .catch((error) => {
    res.json({
      message: error,
      status: false
    });
  });     
};

// ******Change User Status******
const changeUserStatus = async(req, res, msg) => {   
  usersModel
  .findOne({ 'emailVerifyToken':req.body.verifytoken })
  .then((user) => {
    if(user){ 
      user.emailVerified = true;      
      user.updatedAt = new Date();
      user.save()
        .then((response) => { 
          res.json({  
            status:true,
            message: 'User Status Changed Successfully',
            data: response
          })		
        })
        .catch((error) => {
          res.json({
            message: error,
            status: false
          });
        });	

      } else {
        res.json({
          message: "User not exist",
          status: false
        });
      }
  })
  .catch((error) => {
    res.json({
      message: error,
      status: false
    });
  }); 
};

// ******User Signup******
const signup = async(req, res, msg) => {
	if((req.body.id != undefined) && (req.body.id != '')) {
		usersModel.findOne({ _id:mongoose.Types.ObjectId(req.body.id) }, (err, user) => {
			if (!user) {
				res.json({
					status: false,
					info: 'User not found'
				})
			} else {
			  user.isActive = true,
			  user.dealspaceId = dealspace._id;
			  user.workplanId = 1;
			  user.fullName = req.body.name; 
			  user.password = req.body.password; 
			  user.emailVerifyToken = '';
			  user.updatedAt = new Date(); 
			  user.save()
				.then((response) => { 
					let businessaccounts = new businessAccountsModel();
					businessaccounts.save()
						.then((account) => { 
							let dealspace = new dealspaceModel({
								dealspaceName: req.body.dealspacename,
								businessId:account._id
							});
							dealspace.save()
								.then((dealspace) => {    
									res.json({
									  message: "New User Created Successfully",
									  status: true,
									  data: response
									});										
								 })
								.catch((error) => {
									res.json({
										message: error,
										status: false
									 });
								});   
						})
						.catch((error) => {
							res.json({
								message: error,
								status: false
							});
						}); 		  
				})
				.catch((error) => {      
					res.json({
						message: error,
						status: false
					});
				}); 
			}
		});   
	} else {
		res.json({
		  status: false,
		  info: 'User not found'
		});
	}
};

// ******User Login******
const login = async(req, res, msg) => {  
usersModel.findOne({ 'email': req.body.email,'isActive':true,'emailVerified':true })
  .then((user) => {   
    if (!user.validPassword(req.body.password)) {
      res.json({
          status: false,
          message: 'Invalid Password'
      });
    } else {
      let token = auth.gettoken(user._id, user.email);      
      res.json({
          status: true,
          message: ' Login Successfully',
          data: user,
          token: token
      });
    }
  })
  .catch((error) => {
    res.json({
      status: false,
      message: 'No User Found'
    })
  });
};

// *******forgot password  *********
const forgotPassword = (req, res, next) => {
  async.waterfall([
      function (done) {
          crypto.randomBytes(20, (err, buf) => {
              var token = buf.toString('hex');
              done(err, token);
          });
      },
      function (token, done) {
        usersModel.findOne({ email: req.body.email }, (err, user) => {
              if (!user) {
                  res.json({
                      status: false,
                      info: 'User not found'
                  })
              } else {
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save((err) => {
                    done(err, token, user);
                });
              }
          });
      },
      function (token, user, done) {
          var transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                  user: host,
                  pass: pass
              }
          });

          var mailOptions = {
              from: 'support@mergeflow.com',
              to: req.body.email,
              subject: 'MergeFlow - Reset Password',
              html: '<p>We received a request to reset your password.</p><p>To reset your password, click here.' +
                  '<a href="http://13.234.177.61/reset-password' + '">Reset Password</a></p><p>' +
                  '<b>token' + ':' + token + '</b></p><p>' +
                  'If you did not request this, please ignore this email and your password will remain unchanged.</p>'
          };

          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                res.json({
                  message: error,
                  status: false
                });
              } else {
                  res.json({
                      status: true,
                      message: 'Mail Sent Successfully'
                  })
              }
          });
      }
  ], function (err) {
      if (err)
          return next(err);
      else {
          res.json({
              message: 'Retry',
              status: false
          })
      }
  });
}

// *******reset password  *********
const resetPassword = (req, res, next) => {
  async.waterfall([
    function (done) {
        usersModel.findOne({ 'resetPasswordToken': req.body.pwdtoken, 'resetPasswordExpires': { $gt: Date.now() } }, function (err, user) {
          if (!user) {                       
            res.json({
              status: false,
              message: 'Password reset token is invalid or has expired.',
            });
          } else {
            user.password = req.body.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.save()
              .then((response) => {
                  res.json({
                  message: "Password changed",
                  status: true
                  });      
                })
                .catch((error) => {
                  res.json({
                  message: error,
                  status: false
                  });
                }); 
                        
          }                       
        });
    }
  ], function (err) {
     res.json({
      message: 'Retry',
      status: false
    })
  });
}

// ******* Get user details ******
const getUserDetails = async(req, res, next) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/    
  var query = {'workplanId': req.body.workplanId,'isActive':true}; 
  usersModel
    .find(query)
    .then((response) => {
      res.json({
        status: true,
        users: response
      });
    })
    .catch((error) => {
      res.json({
        message: error,
        status: false
      });
    });
};

module.exports = {signup,login,signupConfirmEmail,changeUserStatus,forgotPassword,resetPassword,getUserDetails};
