import { User as prismaUser } from '@prisma/client';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const morgan = require('morgan');
const xss = require('xss-clean');
const hpp = require('hpp');

export const app = express();

dotenv.config();
declare global {
  namespace Express {
    interface Request {
      currentUser?: prismaUser;
    }
  }
}

console.log(process.env.NODE_ENV);

app.use(express.json());

// security features
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
});

app.use(limiter);

// Route files
const auth = require('./routes/auth');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    console.error('Server is not available. Exiting...');
    process.exit(1);
  }
});
