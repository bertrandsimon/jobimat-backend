const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const connectionString = 'mongodb+srv://trandber3278:fv5j4ucWpRWUiqd3@cluster0.qdjfkjz.mongodb.net/jobimat';

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
