/**
 * Created by ben on 12/20/15.
 */
var orm = require("orm");

var connection = null;


function setup(db,cb) {
    require('./User')(orm,db, function(err,db) {
        if(err) cb(err);

        cb(null,db);
    });
}

module.exports = function(cb) {
    if(connection) return cb(null,connection);

    orm.connect("mysql://redditchat:abc123@localhost/redditchat", function(err,db) {
        if(err) {
            console.error(err);
            return cb(err);
        }

        connection = db;
        db.settings.set('instance.returnAllErrors', true);
        setup(db,cb);
    });
};