import {consola} from 'consola';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { mw as requestIp } from 'request-ip';
import { setCallback, asyncValidatorHandler, ApiResponse } from '@qnx/response';
import { logger } from '@qnx/winston';
import {db} from './utils/db'

import './utils/env';
import { users } from '@/schema/user';

const { PORT } = process.env;

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: 'Too many requests in a short time. Please try in a minute.',
      });
    },
  })
);

setCallback({
  logger: {
    serverError: error => {
      logger.error('API Handler:', error);
    },
  },
});

app.get('/', 
  asyncValidatorHandler(async ()=>{ return new ApiResponse().setMessage('Welcome to the API!')})
);



app.get('/healthcheck',  asyncValidatorHandler(async ()=>{
  return new ApiResponse().setMessage( 'Server is running'
  ).setAdditional({
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
 }) 
 );



 app.get('/all-users', 
  asyncValidatorHandler(async ()=>{ 
    return await db
    .select()
    .from(users)
  })
);


app.listen(PORT, () => {
  consola.info(`Server running at http://localhost:${PORT}`);
});
