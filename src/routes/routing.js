const siteRoute = require('./siteRoutes')
const apiRoute =require('./apiRoutes')

function route(app){

    app.use('/api', apiRoute)

    app.use('/', siteRoute )

}

module.exports = route