import express = require('express');
import PersistenceGoogleDatastore from "./persistencegoogledatastore";

export class Routes {

    protected basePath: string;
    protected service:PersistenceGoogleDatastore = new PersistenceGoogleDatastore();

    constructor(NODE_ENV: string){

        switch(NODE_ENV) {
            case 'production':
                this.basePath = '/dist';
                break;
            case 'development':
                this.basePath = '/public';
                break;
        }

    }

    paths(app: express.Application) {

        app.get('/docs', (req, res, next) => {
            this.service.find({}).then(doc => {
                res.type('json').send(doc);
            }).catch(err => {
                return next(err);
            });
        });

        app.get('/doc', (req, res, next) => {
            if (! req.query.id )
                return next(new Error('Must provide one id '));
            this.service.find({id: req.query.id}).then(doc => {
                res.type('json').send(doc);
            }).catch(err => {
                return next(err);
            });
        });

        app.post('/doc', (req, res, next) => {
            console.log(req.body);
            if (! req.body.id )
                return next(new Error('Must provide one id'));
            this.service.insert(req.body).then(doc => {
                res.type('json').send(doc);
            }).catch(err => {
                return next(err);
            });
        });

        /* Delete book by key */
        app.delete('/doc', (req, res, next) => {
            if (! req.query.id )
                return next(new Error('Must provide one id '));

            this.service.remove({id: req.query.id}).then(doc => {
                res.type('json').send(doc);
            }).catch(err => {
                return next(err);
            });
        });

        app.get('/', (req, res) => {
            res.type('text').send('json storage service');
        });

    }

}