import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import { stub, restore } from 'sinon';
import * as authService from '../../src/services/auth.service.js';

describe('Login', () => {
  it('deve retornar 500 quando acontecer algum problema de conexão com o banco de dados', async () => {
    const authServiceMock = stub(authService, 'login');
    authServiceMock.throws(new Error('Erro catastrófico!'));

    const loginResposta = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com',
        senha: 'admin123'
      });

    expect(loginResposta.status).to.equal(500);
    expect(loginResposta.body.error).to.equal('Erro interno do servidor.');

    restore();
  });
});