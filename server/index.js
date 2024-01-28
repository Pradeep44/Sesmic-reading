const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes/index.js");


const app = express();

require('dotenv').config();

mongoose.connect(
  process.env.MONGO_BASE_URL,
  {useNewUrlParser: true})
  .then(() => {
      console.log("connected to db");
  })
  .catch((error) => {
      console.log('error in connecting', error);
  })

app.use(cors());

app.use("/api", router);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
