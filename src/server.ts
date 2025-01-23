import app from './app';
import { config } from "dotenv";
import { dbConnection } from './utils/dbConnection';

config();

const PORT = process.env.PORT || 8080;

dbConnection()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });