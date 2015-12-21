/**
 * Created by ben on 12/20/15.
 */

module.exports = function(orm,db,cb) {
    var User = db.define("user", {
        id                 : {type: "serial", key: true},
        name               : String,
        access_token       : String,
        friends            : Object,
        identity           : Object,
        conversations      : Object,
        photo              : String
    }, {
        methods: {},
        validations: {}
    });


    User.sync(function(err) {
        if(err) cb(err);
        cb(null,db);
    });
};