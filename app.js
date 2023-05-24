// import dependencies.
const express = require('express'); // used to setup node server.
const mongoose = require('mongoose'); // used to manage mongodb db server.
require('dotenv/config'); // used to handle environment variables.
const cors = require('cors'); // handles cross origin resource sharing by providing appropriate headers.
const bodyParser = require('body-parser'); // adds body to request and parses the data in preferred format(JSON,raw,text)

// import required routes.
const blogRoute = require('./routes/blogRoutes');
const userRoute = require('./routes/userRoutes');
const authRoute = require('./routes/authRoutes');

// create an instance of the express app.
const app = express();

// create variable for port number.
const port = process.env.PORT || 5000;

// allow cross origin requests from any domain.
app.use(cors({
  origin: "*",
}));

// parse incoming URL-encoded data (HTML form) and JSON data and
// add it to the req.body object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// connect routes to app.
app.use('/', blogRoute);
app.use('/', userRoute);
app.use('/', authRoute);

// Connect to mongodb database.
mongoose.connect(process.env.DB_CONNECTION,
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then((result) => 
    app.listen(port, () => console.log(`Listening on port ${port}`)),
    console.log('Connected to database')
  )
  .catch((err) => console.log(err)
);