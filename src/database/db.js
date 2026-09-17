import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }

  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  console.log('Banco em memória conectado!');
};

// Inicia a conexão imediatamente ao importar o módulo
await connectDB();

export default connectDB;