import request from 'supertest';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export async function getToken(email, senha) {
  const loginResposta = await request(BASE_URL)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send({
      email: email,
      senha: senha
    });

  return loginResposta.body.token;
}