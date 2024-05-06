const express = require("express")
const router = express.Router()
const userController = require("../controllers/user")

// users routes
router.post('/users/register', userController.createUser)
router.post('/users/login', userController.userLogin)
router.get('/users', userController.getUsers)
router.get('/users/:id', userController.getUserById)
router.put('/users/:id', userController.editUser)
router.delete('/users/:id', userController.deleteUser)

module.exports = router