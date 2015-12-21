var express = require('express');
var router = express.Router();
var RedditAPI = require('../api/RedditApi.js');

/**
 *  RedditChat Auth API
 *
 *  Manages the user authentication process for Reddit OAuth2.
 *  Exposes endpoints to the front end that allow the user action
 *  required by reddit's api.
 */


/**
 * Gets the app permission url, which takes the user to reddit.com
 * to confirm app permissions.
 *
 * Auth step #1
 */
router.get('/initial', function (req, res) {
    res.send(RedditAPI.getAppPermissionUrl(req.session));
});

/**
 * Callback URI required by reddit. Reddit hits this endpoint with a 'code'
 * once the user has confirmed permissions.
 *
 * Auth step #2
 */
router.get('/reddit_callback', function (req, res) {
    res.send(req.query.code);  //TODO: respond with a loading page
});


/**
 * Accepts a 'state' parameter from the client to ensure the uuid from the initial
 * authorization request hasn't been compromised.
 *
 * Auth step #3
 * TODO: Accept the state param
 */
router.put('/access_token', function (req, res) {
    req.session.code = req.body.code;
    res.send("ok");
});


/**
 *  Once permissions have been confirmed and state has been verified,
 *  the access token can now be acquired.
 */
router.get('/access_token', function (req, res) {
    RedditAPI.getAccessToken(req.db,req.session).then(function (tokenData) {
        res.send(tokenData);
    }).catch(function(err) {
        console.info('failure!', err);
        res.send(err);
    });
});

module.exports = router;
