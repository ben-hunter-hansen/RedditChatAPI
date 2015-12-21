/**
 * Created by ben on 12/20/15.
 */
var sessionCtrl   = require('./session_controller'),
    authCtrl      = require('./auth_controller');



module.exports = {
    session: require('./session_controller'),
    authentication: require('./auth_controller')
};