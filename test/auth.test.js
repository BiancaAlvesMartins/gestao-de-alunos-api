import request from 'supertest';
import { expect } from 'chai';

describe('POST /api/auth/login', () => {
  it('deve realizar login com credenciais válidas', async () => {
    const response = await request('http://localhost:3000')
      .post('/api/auth/login')
      .send({
        email: 'admin@escola.com',
        senha: 'admin123'
      });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });
});
