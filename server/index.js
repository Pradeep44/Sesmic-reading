import cors from "cors";
import express from "express";

import router from "./routes/index.js";

const PORT = "9797";

const app = express();

app.use(cors());

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
