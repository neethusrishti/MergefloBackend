const mongoose = require("mongoose");
const async = require("async");
const path = require("path");
const authentication = require('../../config/auth');
const auth = new authentication;
const tasksModel = require("../model/tasks"); //tasks model
const taskHostoryLogsModel = require("../model/taskhistorylogs"); //task history logs model

// ******Create Task******
const createTask = async(req, res, msg) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/
  let task = new tasksModel({
    userId: req.body.userId,
    workplanId: req.body.workplanId,
    taskName: req.body.taskName,
    taskType: req.body.taskType,
    assignee: req.body.assignee,
    completionStatus: req.body.completionStatus,
    priority: req.body.priority,
    description: req.body.description,
    startdate: req.body.startdate,
    duedate: req.body.duedate,
    onetimeCost: req.body.onetimeCost,
    comments: req.body.comments,
    taskParentId: req.body.taskParentId
  });
  task.save()
    .then((response) => {      
      res.json({
        message: "New Task Created Successfully",
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
};

// ******Edit Task******
const editTask = async(req, res, msg) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/
  tasksModel
  .findOne({_id:mongoose.Types.ObjectId(req.body.id)})
  .then((task) => {
    if(task){ 
      task.taskName = req.body.taskName,
      task.assignee = req.body.assignee,
      task.priority = req.body.priority,
      task.description = req.body.description,
      task.startdate = req.body.startdate,
      task.duedate = req.body.duedate,
      task.onetimeCost = req.body.onetimeCost,
      task.comments = req.body.comments,
      task.updatedAt = new Date();
      user.save()
        .then((response) => { 
          res.json({  
            status:true,
            message: 'Task Details Changed Successfully',
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
          message: "Task not exist",
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

// ******Create Task History Log******
const createTaskHistoryLog = async(req, res, msg) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/
  let log = new taskHostoryLogsModel({
    userId: req.body.userId,
    workplanId: req.body.workplanId,
    taskId: req.body.taskId,
    logText: req.body.logText
  });
  log.save()
    .then((response) => {
      res.json({
        message: "New Log Created Successfully",
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
};

// ******change completion status******
const changeCompletionStatus = async (req, res, next) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
      staus: false,
        message: err
    });
  });
  /* end authentication*/
  const taskId = req.body.id
  const completionStatus = req.body.status
  tasksModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(taskId)}, 
  {  
    completionStatus:completionStatus,
    updatedAt: new Date()
  },  
  function(error, data) {
     if(error){
         res.json({
            message: error,
            status: false
         })
     }
     else{
        res.json({  
            status:true,
            message: 'Completion Status Changed Successfully'
        })
     }
  });  
};

// ******change visibility status******
const changeVisibilityStatus = async (req, res, next) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/
  const taskId = req.body.id;
  const visibilityStatus = req.body.status;
  tasksModel.findByIdAndUpdate({_id:mongoose.Types.ObjectId(taskId)}, 
  {  
    visibilityStatus:visibilityStatus,
    updatedAt: new Date()
  },  
  function(error, data) {
     if(error){
         res.json({
            message: error,
            status: false
         })
     }
     else{
        res.json({  
            status:true,
            message: 'Visibility Status Changed Successfully'
        })
     }
  });  
}

// ******* Get subtasks by id ******
const getSubTasksById = async(req, res, next) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/  
  var taskId = req.body.id;
  var query = {'workplanId': req.body.workplanId};
  if((taskId != undefined) && (taskId != '')) {
    query.taskParentId= taskId;
  } else {
    query.taskParentId= '';
  }
  tasksModel
    .find(query)
    .then((response) => {
      res.json({
        status: true,
        data: response,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
        status: false
      });
    });
};

// ******* Get task details ******
const getTasksDetails = async(req, res, next) => {
  /* authentication */  
  let result = await auth.CheckAuth(req.headers["x-access-token"]).catch(err => {
    res.json({
       staus: false,
        message: err
    });
  });
  /* end authentication*/   
  tasksModel
    .findOne({_id: req.body.id})
    .populate('assignee')
    .then((response) => {
      res.json({
        status: true,
        data: response,
      });
    })
    .catch((error) => {
      res.json({
        message: error,
        status: false
      });
    });
};
module.exports = {createTask,createTaskHistoryLog,changeCompletionStatus,changeVisibilityStatus,getSubTasksById,getTasksDetails,editTask};
