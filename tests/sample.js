//During the test the env variable is set to test
// process.env.NODE_ENV = 'develop';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let should = chai.should();
let expect = chai.expect;

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
            .get('/sample/brand')
            .end((err, res) => {
                expect(res).to.have.status(200);
                // expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                expect(res.body).to.be.a('object');
                let body = res.body;                
                // console.log('body:', body);
                
                expect(body).to.have.property('success', true);
                
                expect(body).to.have.property('data');
                expect(body.data).to.be.a('object');
                // expect(Object.keys(body.data)).to.have.lengthOf(9);
                expect(body.data).to.have.property('viettien', 'Việt Tiến');
                done();
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