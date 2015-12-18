/**
 * Created by ben on 12/16/15.
 */
var RedditAPI = require('./RedditApi');

var UserAPI = function() {

    return {

        /**
         * Logs a client in to the app. We really only
         * need to make sure we have a bearer token for the user here,
         * but the frontend needs the identity object right away.  It is
         * returned to indicate a successful login.
         *
         * @param session
         * @returns {Promise}
         */
        login: function(session) {
            return new Promise(function(resolve,reject) {
                if(session.me && session.me.hasOwnProperty("name")) {
                    resolve(session.me);
                } else {
                    RedditAPI.getIdentity(session).then(function(result) {
                        resolve(result);
                    }).catch(function(err) {
                        reject(err);
                    });
                }
            });
        },

        /**
         * Check if the user is logged in or not.
         *
         * @param session
         * @returns {{loggedIn: boolean}}
         */
        status: function(session) {
            return {loggedIn: session.hasOwnProperty("me")};
        },

        /**
         * Destroy session information.
         *
         * @param sid
         * @param store
         */
        logout: function(sid, store) {
            store.destroy(sid, function(err) {});
        }
    }
};
module.exports = new UserAPI();