'use strict';

const Koa = require('koa');
const Router = require('koa-better-router');
const koaBody = require('koa-body');
const logger = require('../index');

const router = Router().loadMethods();

const app = new Koa();

router.get('/200', (ctx, next) => {
    ctx.body = `hello world`;
    return next();
});

router.get('/301', (ctx, next) => {
    ctx.status = 301;
    return next();
});

router.get('/400', (ctx, next) => {
    ctx.status = 400;
    return next();
});

router.get('/500', (ctx, next) => {
    ctx.status = 500;
    return next();
});

app.use(router.middleware());
app.use(logger());

module.exports = app;
