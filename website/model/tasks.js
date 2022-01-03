var mongoose = require('mongoose');
// define the schema for our tasks model
var tasksSchema = mongoose.Schema({
    userId: {type: String, ref: 'Users'},
    workplanId: {type: String, ref: 'DealapaceWorkplans'},
    taskName: {type: String},
    taskType: {type: String},  
    assignee: {type: String, ref: 'Users'},
    completionStatus: {type: Boolean, default: false},
    visibilityStatus: {type: Boolean, default: true},
    priority: {type: String},
    description: {type: String},
    startdate: {type: Date, default: Date.now},  
    duedate: {type: Date, default: Date.now},
    onetimeCost: {type: Number, default: 0},
    comments: {type: String},
    taskParentId: { type: String, default: '', ref: 'Tasks' },
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now}
});
// create the model for tasks and expose it to our app
module.exports = mongoose.model('Tasks', tasksSchema);