import connectDB from '../src/database/db.js';
import mongoose from 'mongoose';
import app from '../src/app.js';
import request from 'supertest';

export async function getToken(email, senha) {
  // Garante que o banco de dados em memória está conectado antes de tentar autenticar
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, senha });

  return response.body.token;
}