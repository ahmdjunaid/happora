import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(process.env.PORT, () => {
    console.info(`Server running on http://localhost:${process.env.PORT}`);
  });
};

start().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});