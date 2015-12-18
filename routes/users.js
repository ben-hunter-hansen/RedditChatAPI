/**
 * Created by ben on 12/17/15.
 */
var express = require('express');
var router = express.Router();
var UserAPI = require('../api/UserApi');


/**
 *  RedditChat User API
 *
 *  This API is not a critical authentication mechanism,
 *  it merely exposes a nice set of endpoints that the front end
 *  can use to determine its session status.
 *
 */


/**
 * Adds identity information to the session, and returns a copy
 * in the response body.
 */
router.post('/login', function(req,res) {
    UserAPI.login(req.session).then(function(result) {
        res.send(result);
    }).catch(function(err) {
        res.send(err);
    });
});


/**
 * Returns an object with a single property that indicates login status.
 *
 * { loggedIn: (true|false) }
 */
router.get('/status', function(req,res) {
    res.send(UserAPI.status(req.session));
});


/**
 * Kills the clients session.
 */
router.post('/logout', function(req,res) {
   UserAPI.logout(req.sessionID, req.session);
    res.send("ok");

});

module.exports = router;