const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Service', () => {
    it('should create a new user', (done) => {
        chai.request('http://localhost:3001')
            .post('/users')
            .send({ id: '1', name: 'John Doe' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id').eql('1');
                done();
            });
    });
    // Add more tests...
});
