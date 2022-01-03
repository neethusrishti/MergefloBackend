const jwt = require("jsonwebtoken");
class authentication{
 gettoken(user_id,email) {    
      const token = jwt.sign(
        { user_id:user_id, email },
        'mergeflowsecretkey',
        {
          expiresIn: "2h",
        }
      );   
      return token;   
  }

  CheckAuth(token){   

    return new Promise(function (resolve, reject) {

        try {
            if (!token)
                return reject('Please pass token');
                const verified = jwt.verify(token,'mergeflowsecretkey');

                jwt.verify(token, 'mergeflowsecretkey', function (err, decoded) {
                  if (err) {
                      return reject('Failed to authenticate token.');
                  } else {
                      // if everything is good, save to request for use in other routes
                      return resolve(verified);
                  }
            });

          
        } catch (error) {

            return reject(error.message);
        }
      
    }) 
  }
}  
  module.exports = authentication;