//During the test the env variable is set to test
// process.env.NODE_ENV = 'develop';

//Require the dev-dependencies
import * as chai from 'chai';
import chaiHttp from 'chai-http';
let should = chai.should();
import { expect } from 'chai'
let app = require('../app');

chai.use(chaiHttp);
//Our parent block
describe('sample', () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });
    /*
     * Test the /GET route
     */
    describe('/GET brand', () => {
        it('it should GET all brand', (done) => {
            chai.request(app)
                .get('/brand')
                .expect('Content-Type', /string/)
                .expect(200)
                .then((res) => {
                    expect(res.body).to.be.a('string');
                    let body = JSON.parse(res.body);
                    expect(body).to.have.property('success', true);
                    
                    expect(body).to.have.property('data');
                    expect(body).data.to.be.a('object');
                    // expect(body).length.to.be.eql(9);
                    expect(body).data.to.have.property('viettien, Việt Tiến');
                });
                /*.end((err, res) => {
                    // res.should.have.status(200);
                    // res.body.should.be.a('object');
                    res.body.should.have.property('success').eql('true');
                    
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    // res.body.length.should.be.eql(9);
                    res.body.data.should.have.property('viettien').eql('Việt Tiến');
                    done();
                });*/
        });
    });
});