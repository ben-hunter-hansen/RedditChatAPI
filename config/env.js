/**
 * Created by ben on 12/20/15.
 */

var express      = require('express'),
    session      = require('express-session'),
    path         = require('path'),
    logger       = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser   = require('body-parser'),
    uuid         = require('node-uuid'),
    models       = require('../models/');

module.exports = function(app) {

    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(session({
        genid: function (req) {
            return uuid.v1();
        },
        resave: false,
        saveUninitialized: false,
        secret: 'abc123'
    }));

    app.use(function(req,res,next) {
        models(function(err,db) {

            req.models = db.models;
            req.db = db;

            return next();
        });
    });


    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: err
            });
        });
    }

    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
};