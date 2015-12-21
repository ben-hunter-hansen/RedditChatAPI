var express   = require('express'),
    authorize = require('./routes/authorize'),
    users     = require('./routes/users'),
    config    = require('./config/'),
    app       = express();


config.setup(app);

// Deprecated endpoints, will be removed soon
app.use('/authorize', authorize);
app.use('/users', users);

module.exports = app;
