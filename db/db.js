/**
 * Created by ben on 12/20/15.
 */

var orm = require("orm");

var test = function() {
    return {
        testConnection: function() {

            orm.connect("mysql://redditchat:abc123@localhost/redditchat", function (err, db) {
                if (err)throw err;

                var User = db.define("user", {
                    id                 : {type: "serial", key: true},
                    name               : String,
                    access_token       : String,
                    identity           : Object,
                    friends            : Object,
                    conversations      : Object,
                    photo              : String
                }, {
                    methods: {},
                    validations: {}
                });

                // add the table to the database
                db.sync(function(err) { console.log(err)});
            });
        }
    }
};

module.exports = test();