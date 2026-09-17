import connectDB from '../src/database/db.js';
import app from '../src/app.js';

let server;

before(async function () {
  this.timeout(30000);
  
  // Conecta ao banco de dados em memória
  await connectDB();
  
  // Sobe o servidor HTTP na porta 3000 para atender aos testes externos
  const PORT = process.env.PORT || 3000;
  await new Promise((resolve) => {
    server = app.listen(PORT, () => resolve());
  });
});

after(async function () {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});