const mongoose = require('mongoose');
const config = require('config');
const db = config.get('azureCosmo');

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      //   auth: { user: 'thomas.brown1125@gmail.com', password: 'dttbFU#25' },
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
