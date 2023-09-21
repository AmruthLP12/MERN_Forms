const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://amruthgowd91200:amruth91200@mern.fm9kk34.mongodb.net/demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("Connected to MongoDB database");
});

module.exports = mongoose;
