const express = require('express')
const router = express.Router()

const apiController = require('../controllers/apiController')

router.get('/users', apiController.users)
router.get('/data', apiController.data)

module.exports = router