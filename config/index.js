/**
 * Created by ben on 12/20/15.
 */

module.exports = {
    setup: function(app) {
        require('./env')(app);
        require('./routes')(app);
    }
};

