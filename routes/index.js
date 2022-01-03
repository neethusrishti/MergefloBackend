var express = require('express');
var router = express.Router();
const user = require('../website/controller/user');
const task = require('../website/controller/task');
//router.post('/addContact',contact.addContact)//add Contact
router.post('/login', user.login) // login user 

router.post('/signupConfirmEmail', user.signupConfirmEmail) // confirm user email on signup
router.post('/changeUserStatus', user.changeUserStatus) // confirm user email on signup
router.post('/signup', user.signup) // signup user
router.post('/forgotPassword', user.forgotPassword) // forgot password
router.post('/resetPassword', user.resetPassword) // reset password
router.get('/getUserDetails', user.getUserDetails) // get user details

router.post('/createTask', task.createTask) // create task 
router.post('/editTask', task.editTask) // edit task
router.post('/changeCompletionStatus', task.changeCompletionStatus) // change completion status 
router.post('/changeVisibilityStatus', task.changeVisibilityStatus) // change visibility status
router.post('/getSubTasksById', task.getSubTasksById) // get tasks by ID 
router.get('/getTasksDetails', task.getTasksDetails) // get tasks details

router.post('/createTaskHistoryLog', task.createTaskHistoryLog) // create task 
router.get('/', function (req, res) {    
    res.send("<h1>Mergeflow backend root</h1>");
}) // get all contact 
module.exports = router
