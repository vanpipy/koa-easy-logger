'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sc = require('sinon-chai');
const request = require('supertest');
const colors = require('colors/safe');
const app = require('./test-server');

chai.use(sc);

const expect = chai.expect;

const responseText = 'hello world';
const responseSize = responseText.length.toFixed();
let sandbox, log;

describe('koa-easy-logger', () => {
    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        log = sandbox.spy(console, 'log');
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('should log when a request', (done) => {
        request(app.listen())
            .get('/200')
            .expect(200, responseText, () => {
                expect(log).to.have.been.called;
                done();
            });
    });

    it('should be request with correct method and url', (done) => {
        request(app.listen())
            .get('/200')
            .expect(200)
            .expect('Content-Length', responseSize)
            .expect((res) => {
                expect(log).to.have.been.calledWith('<-- %s %s %s Host: %s', 'GET', '/200', 'HTTP', res.request.req._headers.host);
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should log when a response', (done) => {
        request(app.listen())
            .get('/200')
            .expect(200, () => {
                expect(log).to.have.been.calledTwice;
                done();
            });
    });

    it('should log a 200 response', (done) => {
        request(app.listen())
            .get('/200')
            .expect(200)
            .expect((res) => {
                expect(log).to.have.been.calledWith('--> %s %s %s %s Time-Cost: %s ms', 'GET', '/200', colors.green('200'), responseSize + 'b', sinon.match.any);
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should log a 301 response', (done) => {
        request(app.listen())
            .get('/301')
            .expect(301)
            .expect((res) => {
                expect(log).to.have.been.calledWith('--> %s %s %s %s Time-Cost: %s ms', 'GET', '/301', colors.white('301'), '', sinon.match.any);
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should log a 400 response', (done) => {
        request(app.listen())
            .get('/400')
            .expect(400)
            .expect((res) => {
                expect(log).to.have.been.calledWith('--> %s %s %s %s Time-Cost: %s ms', 'GET', '/400', colors.red('400'), '', sinon.match.any);
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });

    it('should log a 500 response', (done) => {
        request(app.listen())
            .get('/500')
            .expect(500)
            .expect((res) => {
                expect(log).to.have.been.calledWith('--> %s %s %s %s Time-Cost: %s ms', 'GET', '/500', colors.red('500'), '', sinon.match.any);
            })
            .end((err, res) => {
                if (err) { return done(err); }
                done();
            });
    });
});
