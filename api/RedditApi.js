/**
 * Created by ben on 12/16/15.
 */

var request = require('request');
var querystring = require('querystring');
var uuid = require('node-uuid');
var CLIENT_SECRET = require('../secrets').reddit.CLIENT_SECRET;

var RedditAPI = function() {

    const AuthConstants = {
        CLIENT_ID: "IHSrsKpXaWctZg",
        REDIRECT_URI: "http://localhost:3000/authorize/reddit_callback",
        AUTH_ENDPOINT: "https://ssl.reddit.com/api/v1/authorize.compact?",
        ACCESS_TOKEN_ENDPOINT: "https://IHSrsKpXaWctZg:"+CLIENT_SECRET+"@ssl.reddit.com/api/v1/access_token"
    };


    const Endpoints = {
        ME: 'https://oauth.reddit.com/api/v1/me'
    };

    // Helper function for creating request headers
    var buildReqHeaders = function(accessToken) {
        return {
            'Authorization':'bearer '+accessToken,
            'User-Agent': 'RedditChat v0.1'
        }
    };

    return {

        /**
         * Appends the required parameters to the initial authorization url and returns it.
         * This url takes the user to reddit.com to confirm app permissions.
         *
         * @param session
         * @returns {string}
         */
        getAppPermissionUrl: function(session) {

            var payload = {
                client_id: AuthConstants.CLIENT_ID,
                response_type: "code",
                state: uuid.v1(),
                duration: "temporary",
                redirect_uri: AuthConstants.REDIRECT_URI,
                scope: "identity"
            };

            session.state = payload.state;
            return AuthConstants.AUTH_ENDPOINT + querystring.stringify(payload);
        },

        /**
         * Gets the reddit Oauth2 access token, which is required
         * for api requests.
         *
         * @param session
         * @returns {Promise}
         */
        getAccessToken: function(db,session) {

            var requestToken = new Promise(function(resolve,reject) {
                console.info('requesting token');
                var onComplete = function(err,resp,body) {
                    if(err) reject(err);

                    resolve(JSON.parse(body)["access_token"]);
                };

                request.post({
                    url: AuthConstants.ACCESS_TOKEN_ENDPOINT,
                    body: querystring.stringify({
                        grant_type: 'authorization_code',
                        code: session.code,
                        redirect_uri: AuthConstants.REDIRECT_URI
                    })
                }, onComplete);
            });

            var requestIdentity = function(accessToken) {
                console.info('requesting id');
                return new Promise(function(resolve,reject) {
                    var onComplete = function(err, resp, body) {

                        if(!err && JSON.parse(body).hasOwnProperty("name")) {
                            resolve({identity: JSON.parse(body), access_token: accessToken});
                        } else {
                            reject("Unable to resolve identity");
                        }
                    };
                    request.get({ url: Endpoints.ME, headers: buildReqHeaders(accessToken)}, onComplete);
                });
            };


            var saveUser = function(userData) {
                var serialize = function(accessToken,identity) {
                    return {
                        name: identity.name,
                        access_token: accessToken,
                        friends: {},
                        identity: identity,
                        conversations: {},
                        photo: ""
                    }
                };

                return new Promise(function(resolve,reject) {
                    console.log(serialize(userData.access_token, userData.identity));
                    db.models.user.create(serialize(userData.access_token, userData.identity), function(err,usr) {
                        if(err) {
                            reject(err);
                        } else {
                            resolve(usr);
                        }
                    });
                });
            };

            return requestToken
                .then(requestIdentity)
                .then(saveUser);

        },

        /**
         * Gets user information from the /me endpoint.
         *
         * @param session
         * @returns {Promise}
         */
        getIdentity: function(session) {

            return new Promise(function(resolve,reject) {

                var onComplete = function(err, resp, body) {
                    if(!err && JSON.parse(body).hasOwnProperty("name")) {
                        session.me = JSON.parse(body);
                        resolve(body);
                    } else {
                        reject("Unable to resolve identity");
                    }
                };

               if(session.accessToken) {
                   request.get({ url: Endpoints.ME, headers: buildReqHeaders(session.accessToken)}, onComplete);
               } else {
                   reject("No access token");
               }
            });
        }
    };
};

module.exports = new RedditAPI();