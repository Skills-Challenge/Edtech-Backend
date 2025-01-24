require('dotenv').config();
import express = require('express');
import cors = require('cors');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import authRouter from './routes/auth.routes';
import swaggerUi = require("swagger-ui-express");
import swaggerJsDoc = require("swagger-jsdoc");
import userRouter from './routes/user.routes';
import challengeRouter from './routes/challenge.routes';
import isAuthenticated from './middlewares/auth.middleware';
import errorHandler from './utils/errorHandler';
import ChallengeService from './services/challenge.service';

const app = express();
app.use(cors());


app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  origin && res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE',
  );
  res.setHeader(
    'Access-Contxprol-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization',
  );
  next();
});

app.use((req, res, next) => {
  console.log(req.originalUrl, '\t', req.method, '\t', req.url);
  next();
});

app.use('/auth', authRouter);
app.use('/user', isAuthenticated, userRouter);
app.use("/challenge", challengeRouter);


app.get('/', (req, res) => {
  res.send('Hello world');
});

const swaggerOptions = {
    swaggerDefinition: {
      info: {
        title: "Umurava Service Documentation",
        version: "1.0.0",
        contact: {
          name: "Nzabera Mike Peter",
        },
        servers: ["http://localhost:8000","https://edtech-backend-00ii.onrender.com"],
      },
      components: {
        securitySchemes: {
          CookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "token",
          },
        },
      },
      security: [
        {
          CookieAuth: [],
        },
      ],
      tags: [
        {
          name: "Auth",
          description: "Authentication",
        },
        {
          name: "User",
          description: "User Operations",
        },
        {
          name: "Challenge",
          description: "Challenge Operations",
        },
      ],
    },
    apis: ["./src/controllers/*.ts"],
  };
  
  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);


export default app;
