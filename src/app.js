const express = require("express");
const userRouter = require("./routes/userRoutes");
const app = express();
const mongoose = require("mongoose");

app.use("/reply-mind/api", userRouter);

mongoose
  .connect(
    "mongodb+srv://hasibullah04:sRZl7mi8lXF3BCtv@cluster0.ywl2kst.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
