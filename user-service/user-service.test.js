const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

describe('User Service', function() {
    const server = 'http://localhost:3001';

    it('should create a new user', function(done) {
        chai.request(server)
            .post('/users')
            .send({ id: '1', name: 'John Doe' })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id').eql('1');
                done();
            });
    });

    it('should not create a user with the same ID', function(done) {
        chai.request(server)
            .post('/users')
            .send({ id: '1', name: 'Jane Doe' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('message').eql('User already exists');
                done();
            });
    });

    it('should retrieve user details by ID', function(done) {
        chai.request(server)
            .get('/users/1')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('id').eql('1');
                done();
            });
    });

    it('should return 404 for a non-existent user', function(done) {
        chai.request(server)
            .get('/users/2')
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('message').eql('User not found');
                done();
            });
    });
});
