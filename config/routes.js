/**
 * Created by ben on 12/20/15.
 */
var sessionRouter = require('express').Router(),
    authRouter    = require('express').Router(),
    controllers   = require('../controllers/');


sessionRouter   .post('/login', controllers.session.login);
sessionRouter   .get('/status', controllers.session.status);
sessionRouter   .post('/logout', controllers.session.logout);

authRouter      .get('/initial', controllers.authentication.initial);
authRouter      .get('/permissions', controllers.authentication.permissions);
authRouter      .put('/check_state', controllers.authentication.checkState);
authRouter      .get('/access_token', controllers.authentication.accessToken);

module.exports = function(app) {
    app.use('/session', sessionRouter);
    app.use('/auth', authRouter);
};