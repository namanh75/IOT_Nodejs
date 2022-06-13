const express = require('express')
const router = express.Router()

const siteController = require('../controllers/siteController')

router.get('/login', siteController.login)
router.post('/login', siteController.loginPost)
router.get('/logout', siteController.logout)
router.get('/register', siteController.register)
router.get('/', siteController.index)

module.exports = router