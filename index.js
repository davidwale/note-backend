const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const signupRoutes = require('./src/routes/signupRoute');
const loginRoutes = require('./src/routes/loginRoute');
const userInfoRoutes = require('./src/routes/userInfoRoute');
const noteRoutes = require('./src/routes/noteRoute');


const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Database Connection Successful');
    })
    .catch((e) => {
        console.error('Error connecting to MongoDB:', e.message);
});


app.use(signupRoutes);
app.use(loginRoutes);
app.use(userInfoRoutes);
app.use(noteRoutes);

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});


  // 