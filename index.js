const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
require('dotenv').config();

connectToMongo();
const app = express();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/userdata", require("./routes/formdata"));

app.listen(port, () => { 
  console.log(`Example app listening on port ${port}`);
});
