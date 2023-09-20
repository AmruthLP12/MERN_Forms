// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Connected to MongoDB database");
});

// Define a MongoDB Schema for your data
const formDataSchema = new mongoose.Schema({
  textValue: String,
  selectedOption: String,
  selectedOptions: [String],
  isChecked: Boolean,
  startDate: Date,
  datetimeValue: Date,
  color: String,
  currentDate: Date,
  currentTime: String,
  radioChoice: String,
});

const FormData = mongoose.model("FormData", formDataSchema);

// Create an endpoint to handle form data submissions
app.post("/api/submit-form", (req, res) => {
  const formData = new FormData(req.body);

  formData
    .save()
    .then(() => {
      res.json("Form data saved successfully!");
    })
    .catch((err) => {
      res.status(400).send("Error saving form data: " + err);
    });
});

// Create an endpoint to retrieve form data
app.get("/api/get-form-data", (req, res) => {
    FormData.find()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ error: "Error retrieving form data" });
      });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
