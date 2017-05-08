/**
 * Created by Стас on 08.05.2017.
 */
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let User = require('../db/user');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('User', () => {
    beforeEach((done) => { //Before each test we empty the database
        User.remove({}, (err) => {
            done();
        });
    });

    /*
     * Test the /GET session route
     */

    describe('/GET session ', () => {
        it('it should return 400 with wrong session tocen', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });
            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .get('/session')
                            .set('x-access-token', 'lalala')
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.be.a('Object');
                                res.body.should.have.property('success').eql(false);
                                done();
                            });
                    });
            });
        });

        it('it should GET session user by tocen', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });
            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .get('/session')
                            .set('x-access-token', res.body.token)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('Object');
                                res.body.should.have.property('name').eql('1231');
                                res.body.should.have.property('password').eql("1231");
                                res.body.should.have.property('_id');
                                done();
                            });
                    });
            });

        });
    });

    /*
     * Test the /POST session route
     */

    describe('/POST session', () => {
        it('it should return success obj aut', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });
            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {

                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        done();
                    });
            });
        });

        it('it should return 401 without username', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });
            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({ password: '1231'})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property('success').eql(false);
                        done();
                    });
            });
        });

        it('it should return 401 without password', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });
            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({ name: '1231'})
                    .end((err, res) => {
                        res.should.have.status(401);
                        res.body.should.have.property('success').eql(false);
                        done();
                    });
            });
        });
    });

    /*
     * Test the /GET users route
     */

    describe('/GET users ', () => {
        it('it should GET all the Users (but array eql 0)', (done) => {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });

        it('it should GET all the Users(but array eql 1)', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });
            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .get('/users')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        res.body.length.should.be.eql(1);
                        done();
                    });
            })
        });
    });

    /*
     * Test the /POST users route
     */

    describe('/POST users', () => {
        it('it should register user', (done) => {
            let newUser = {
                name: "111",
                password: "111"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .post('/users')
                            .set('x-access-token', res.body.token)
                            .send(newUser)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('name').eql('111');
                                res.body.should.have.property('password').eql("111");
                                done();
                            });
                    });
            });
        });

        it('it should return 403 and error - user already exist', (done) => {
            let newUser = {
                name: "1231",
                password: "1231"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .post('/users')
                            .set('x-access-token', res.body.token)
                            .send(newUser)
                            .end((err, res) => {
                                res.should.have.status(403);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql('user already exist');
                                done();
                            });
                    });
            });
        });

        it('it should return 400 without username and error - invalid_request', (done) => {
            let newUser = {
                password: "1231"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .post('/users')
                            .set('x-access-token', res.body.token)
                            .send(newUser)
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.be.a('object');
                                res.body.should.have.property('ErrorCode').eql('invalid_request');
                                res.body.should.have.property('Error').eql('Required param : username/password');
                                done();
                            });
                    });
            });
        });
    });

    /*
     * Test the /PATCH users route
     */

    describe('/PATCH users', () => {

        it('it should update user 1231 password to 111', (done) => {
            let updatedUser = {
                password: "111"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .patch('/users/1231')
                            .set('x-access-token', res.body.token)
                            .send(updatedUser)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('message').eql('User updated!');
                                res.body.user.should.have.property('password').eql('111');
                                done();
                            });
                    });
            });
        });


        it('it should update user 1231', (done) => {
            let updatedUser = {
                name: "111",
                password: "111"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .patch('/users/1231')
                            .set('x-access-token', res.body.token)
                            .send(updatedUser)
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('message').eql('User updated!');
                                res.body.user.should.have.property('name').eql('111');
                                res.body.user.should.have.property('password').eql('111');
                                done();
                            });
                    });
            });
        });

        it('it return 400 and err - invalid url', (done) => {
            let updatedUser = {
                name: "111",
                password: "111"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .patch('/users')
                            .set('x-access-token', res.body.token)
                            .send(updatedUser)
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql('invalid url');
                                done();
                            });
                    });
            });
        });

        it('it return 404 and err - user not found', (done) => {
            let updatedUser = {
                name: "111",
                password: "111"
            };

            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .patch('/users/17771')
                            .set('x-access-token', res.body.token)
                            .send(updatedUser)
                            .end((err, res) => {
                                res.should.have.status(404);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql("user not found");
                                done();
                            });
                    });
            });
        });
    });

    /*
     * Test the /DELETE users route
     */

    describe('/DELETE users', () => {
        it('it should delete user 1231', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .delete('/users/1231')
                            .set('x-access-token', res.body.token)
                            .send()
                            .end((err, res) => {
                                res.should.have.status(200);
                                res.body.should.be.a('object');
                                res.body.should.have.property('msg').eql('1231 deleted successfully');
                                done();
                            });
                    });
            });
        });

        it('it should return 400 because invalid url', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .delete('/users/')
                            .set('x-access-token', res.body.token)
                            .send()
                            .end((err, res) => {
                                res.should.have.status(400);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql('invalid url');
                                done();
                            });
                    });
            });
        });

        it('it should return 404 because user not found', (done) => {
            let user = new User({
                name: "1231",
                password: "1231"
            });

            user.save((err) => {
                if (err) throw(err);
                chai.request(server)
                    .post('/session')
                    .send({name: '1231', password: "1231"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('success').eql(true);
                        res.body.should.have.property('message').eql("Enjoy your token!");
                        res.body.should.have.property('token');
                        chai.request(server)
                            .delete('/users/1123712')
                            .set('x-access-token', res.body.token)
                            .send()
                            .end((err, res) => {
                                res.should.have.status(404);
                                res.body.should.be.a('object');
                                res.body.should.have.property('error').eql("user not found");
                                done();
                            });
                    });
            });
        });
    });
});