const mongoose = require('mongoose');
require('dotenv').config();
module.exports = () =>
  mongoose
    .connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify:false
    })
    .then((res) => {
      console.log('Database Connection Successful');
    })
    .catch((err) => {
      console.log('Database not connected ' + err);
    });
