import request from 'supertest';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { getToken } from '../../helpers/authHelper.js';

const alunoData = JSON.parse(readFileSync(new URL('../../data/alunoData.json', import.meta.url)));
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Função utilitária para aguardar a API subir no servidor CI/CD
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Fluxo Completo de Aluno e Entrega de Trabalho', function () {
  this.timeout(10000); // Aumenta timeout do Mocha para evitar estouro no CI

  let tokenAdmin;
  let tokenAluno;

  before(async () => {
    // Aguarda 2 segundos para o servidor e o MongoDB no GitHub inicializarem a rede
    await delay(2000);
    tokenAdmin = await getToken(alunoData.admin.email, alunoData.admin.senha);
  });

  it('deve cadastrar um aluno como admin, logar como o novo aluno e entregar um trabalho', async () => {
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

    expect(resCadastro.status).to.be.oneOf([201, 200, 400]);

    tokenAluno = await getToken(alunoData.aluno.email, alunoData.aluno.senha);
    expect(tokenAluno).to.be.a('string');

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
});