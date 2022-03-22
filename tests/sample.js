//During the test the env variable is set to test
// process.env.NODE_ENV = 'develop';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

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
            chai.request(server)
                .get('/brand')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('object');
                    // res.body.length.should.be.eql(9);
                    res.body.data.should.have.property('viettien').eql('Việt Tiến');
                    done();
                });
        });
    });
});