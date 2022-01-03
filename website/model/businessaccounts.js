var mongoose = require('mongoose');
// define the schema for business account model
var businessAccountsSchema = mongoose.Schema({   
    accountName: {type: String},
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now} 
});
// create the model for business account and expose it to our app
module.exports = mongoose.model('BusinessAccounts', businessAccountsSchema);