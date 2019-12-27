const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const items = require('./routes/api/items');

const app = express();

//body parser middleware
app.use(bodyParser.json());

//DB Config
const db = require("./config/keys").mongoURI;

// Serve static assets if in production.
if(process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
//Connect to Mongo
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

  const port = process.env.PORT || 5000;

  //Use Routes
  app.use('/api/items', items)
  app.listen(port, () => console.log(`Server started on port ${port}`));
