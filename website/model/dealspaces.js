var mongoose = require('mongoose');
// define the schema for dealspace model
var dealSpacesSchema = mongoose.Schema({      
    dealspaceName: {type: String},
    businessId: {type: String, ref: 'BusinessAccounts'}, 
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now} 
});
// create the model for dealspace and expose it to our app
module.exports = mongoose.model('DealSpaces', dealSpacesSchema);