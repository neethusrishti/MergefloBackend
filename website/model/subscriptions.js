var mongoose = require('mongoose');
// define the schema for subscriptions model
var subscriptionsSchema = mongoose.Schema({      
    title: {type: String},
    amount: {type: Number, default: 0}, 
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now} 
});
// create the model for subscriptions and expose it to our app
module.exports = mongoose.model('Subscriptions', subscriptionsSchema);