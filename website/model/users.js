var mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// define the schema for users model
var usersSchema = mongoose.Schema({    
    fullName: {type: String},    
    email: {type: String},  
    password: {type: String},   
    isActive: { type: String, default: "false" },  
    dealspaceId: {type: String, ref: 'DealSpaces'}, 
    workplanId: {type: String, ref: 'DealapaceWorkplans'},
    subscriptionId: {type: String, ref: 'Subscriptions'},
    emailVerified: { type: String, default: "false" },  
    emailVerifyToken: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now}
});
// methods ======================
// generating a hash
usersSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(8, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// checking if password is valid
usersSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('Users', usersSchema);