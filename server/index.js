const cors = require("cors");
const express = require("express");

const router = require("./routes/index.js");

const PORT = "9797";

const app = express();

app.use(cors());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
