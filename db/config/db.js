const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
    });

    console.log(`Database Connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
