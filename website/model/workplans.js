var mongoose = require('mongoose');
// define the schema for workplans model
var workplansSchema = mongoose.Schema({      
    workplanName: {type: String},
    status: {type: String}, 
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now} 
});
// create the model for workplans and expose it to our app
module.exports = mongoose.model('Workplans', workplansSchema);