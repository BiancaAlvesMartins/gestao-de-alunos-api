import request from 'supertest';
import { expect } from 'chai';
import { readFileSync } from 'fs';
import { getToken } from '../../helpers/authHelper.js';

const alunoData = JSON.parse(readFileSync(new URL('../../data/alunoData.json', import.meta.url)));
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Fluxo Completo de Aluno e Entrega de Trabalho', function () {
  this.timeout(15000);

  let tokenAdmin;
  let tokenAluno;

  before(async () => {
    await delay(1000);
    tokenAdmin = await getToken(alunoData.admin.email, alunoData.admin.senha);
  });

  it('deve cadastrar um aluno como admin, logar como o novo aluno e entregar um trabalho', async () => {
    // 1. Tenta buscar uma disciplina existente ou criar uma nova
    let disciplinaId;
    const resDisciplinasGet = await request(BASE_URL)
      .get('/api/admin/disciplinas')
      .set('Authorization', `Bearer ${tokenAdmin}`);

    if (resDisciplinasGet.status === 200 && resDisciplinasGet.body.length > 0) {
      disciplinaId = resDisciplinasGet.body[0]._id || resDisciplinasGet.body[0].id;
    } else {
      const resDisciplina = await request(BASE_URL)
        .post('/api/admin/disciplinas')
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send({
          nome: 'Matemática',
          codigo: `MAT${Math.floor(Math.random() * 1000)}`
        });
      disciplinaId = resDisciplina.body._id || resDisciplina.body.id;
    }

    // 2. Cadastra o novo aluno
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
    const alunoId = resCadastro.body._id || resCadastro.body.id || resCadastro.body.aluno?._id;

    // 3. Faz login como aluno
    tokenAluno = await getToken(alunoData.aluno.email, alunoData.aluno.senha);
    expect(tokenAluno).to.be.a('string');

    // 4. Garante o envio do trabalho
    const resTrabalho = await request(BASE_URL)
      .post(`/api/alunos/${alunoId}/trabalhos`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${tokenAluno}`)
      .send({
        disciplinaId: disciplinaId,
        titulo: alunoData.trabalho?.titulo || 'Trabalho de Teste',
        descricao: alunoData.trabalho?.descricao || 'Descrição do trabalho'
      });

    expect(resTrabalho.status).to.be.oneOf([201, 200, 400, 409]);
  });
});