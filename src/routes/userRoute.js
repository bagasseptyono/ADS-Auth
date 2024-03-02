const express = require('express');
const router = express.Router();

const userController = require('../controller/userController')

const authMiddleware = require('../middlewares/authMiddleware')


const { upload } = require('../middlewares/uploadMiddleware') 
router.get("/",authMiddleware.authenticate, userController.findUserById)
router.post("/", upload.single('photo_profile') , userController.createUser)
router.put("/",authMiddleware.authenticate, upload.single('photo_profile') , userController.editUser)
router.delete("/",authMiddleware.authenticate, userController.deleteUser)

module.exports = router;