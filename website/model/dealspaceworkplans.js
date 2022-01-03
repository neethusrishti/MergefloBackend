var mongoose = require('mongoose');
// define the schema for dealspace workplans model
var dealspaceWorkplansSchema = mongoose.Schema({      
    workplanName: {type: String},
    dealspaceId: {type: String, ref: 'DealSpaces'}, 
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now} 
});
// create the model for dealspace workplans and expose it to our app
module.exports = mongoose.model('DealapaceWorkplans', dealspaceWorkplansSchema);