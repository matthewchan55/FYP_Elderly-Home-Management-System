require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");

const app = express()
//middleware
app.use(express.json());
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

// routes
const userRoutes = require('./routes/user')
app.use('/api/user', userRoutes)


// connect to db
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Connected to db and Listening on port", process.env.PORT);
      });
  })
  .catch((error) => {
    console.log(error);
  });


