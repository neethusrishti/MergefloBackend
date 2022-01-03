var mongoose = require('mongoose');
// define the schema for task history log model
var taskHistoryLogsSchema = mongoose.Schema({
    userId: {type: String, ref: 'Users'},
    workplanId: {type: String, ref: 'DealapaceWorkplans'},
    taskId: {type: String, ref: 'Tasks'},
    logText: {type: String},
    createdAt: {type: Date, default: Date.now},  
    updatedAt: {type: Date, default: Date.now} 
});
// create the model for task history log and expose it to our app
module.exports = mongoose.model('TasksHistoryLogs', taskHistoryLogsSchema);