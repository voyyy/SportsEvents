const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const eventRoute = require("./routes/event");
const userRoute = require("./routes/user");
const cors = require("cors");

const app = express();

dotenv.config();
app.use(express.json({ extended: false }));
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/event", eventRoute);
app.use("/api/user", userRoute);

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to mongodb");
  })
  .then(() => {
    const port = process.env.SERVER_PORT;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  });
