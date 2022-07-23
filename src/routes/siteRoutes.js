const express = require('express')
const router = express.Router()

const siteController = require('../controllers/siteController')
const accountController = require('../controllers/accountController')
router.get('/login', siteController.login)
router.post('/login', siteController.loginPost)
router.get('/login/check', siteController.check)
router.get('/logout', siteController.logout)

router.get('/introduction', siteController.info)
router.get('/history', siteController.history)
router.get('/information', accountController.info)
router.put('/information/change', accountController.change)

router.post('/checkon', siteController.checkOn)

router.get('/', siteController.index)



module.exports = router