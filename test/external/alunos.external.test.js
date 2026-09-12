import request from 'supertest';
import { expect } from 'chai';
import 'dotenv/config';
import { getToken } from '../../helpers/authHelper.js';
import alunoData from '../../data/alunoData.json' assert { type: 'json' };

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

describe('Fluxo Completo de Aluno e Entrega de Trabalho', () => {
  let tokenAdmin;
  let tokenAluno;

  before(async () => {
    // 1. Logar como Administrador via Helper
    tokenAdmin = await getToken(alunoData.admin.email, alunoData.admin.senha);
  });

  it('deve cadastrar um aluno como admin, logar como o novo aluno e entregar um trabalho', async () => {
    // 2. Cadastrar um aluno como Admin
    const resCadastro = await request(BASE_URL)
      .post('/api/admin/alunos')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        nome: alunoData.aluno.nome,
        email: alunoData.aluno.email,
        senha: alunoData.aluno.senha,
        matricula: alunoData.aluno.matricula
      });

    expect(resCadastro.status).to.be.oneOf([201, 200, 400]); // 400 aceito caso o aluno já exista na base de dados

    // 3. Logar como Usuário/Aluno cadastrado via Helper
    tokenAluno = await getToken(alunoData.aluno.email, alunoData.aluno.senha);
    expect(tokenAluno).to.be.a('string');

    // 4. Registrar a entrega de um trabalho como Aluno
    const resTrabalho = await request(BASE_URL)
      .post('/api/alunos/trabalhos')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send({
        titulo: alunoData.trabalho.titulo,
        descricao: alunoData.trabalho.descricao
      });

    expect(resTrabalho.status).to.be.oneOf([201, 200]);
  });