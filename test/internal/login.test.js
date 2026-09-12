import request from 'supertest';
import { expect } from 'chai';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('Login - Validação de Entrada', () => {
  it('deve retornar 400 ou 401 ao tentar logar sem credenciais válidas', async () => {
    const res = await request(BASE_URL)
      .post('/api/auth/login')
      .send({ email: 'invalido@teste.com', senha: '123' });

    expect(res.status).to.be.oneOf([400, 401]);
  });
});