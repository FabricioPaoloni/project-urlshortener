require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const { urlToHttpOptions } = require('node:url');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');
// const AutoIncrement = require('mongoose-sequence')(mongoose);
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});



//connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

//test the connection with MongoDB and log to the console.
let connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
  console.log('MongoDB connection established succesfully');
});


//create the schema for the url database
const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
})

//Define the schema used to query and update the sequence value for each short_url
const counterSchema = new mongoose.Schema({
  _id: String,
  sequence_value: Number
})


const URL = mongoose.model('URL', urlSchema);

const counter = mongoose.model('counter', counterSchema, 'counters');

async function getNextSequenceValue(sequenceName) {
  let sequenceDocument = await counter.findOneAndUpdate(
    {_id: sequenceName},
    {$inc:{sequence_value:1}},
    {new: true}
  );
  return sequenceDocument.sequence_value;
}






app.post('/api/shorturl', async function (req, res) {

  let urlInput = req.body.url; //take the url from the form in index.html

  //if dns doesn't exists, return an error, else continue the program
  if (!validUrl.isWebUri(urlInput)) {
    res.json({
      error: "invalid url"
    })
  }

  try { //try to find if url has been already added
    let findUrl = await URL.findOne({
      original_url: urlInput
    })
    if (findUrl) { //if it was created before, return the data
      res.json({
        original_url: findUrl.original_url,
        short_url: findUrl.short_url
      })
    } else {//if it was not created, we create a new record with the url

      findUrl = new URL({
        original_url: urlInput,
        short_url: await getNextSequenceValue('short-url')
      })

      findUrl.save()
      res.json({
            original_url: findUrl.original_url,
            short_url: findUrl.short_url
      })
    }
  }

  catch (err) {//if some error occur, return an error message.
    console.error(err)
    res.status(500).json({ error: 'An error has ocurred' })
  }

})

app.get('/api/shorturl/:short_url?', async function (req, res) {
  try {
    let findShortUrl = await URL.findOne({ short_url: req.params.short_url })
      
    if (findShortUrl){
      res.redirect(findShortUrl.original_url);
    } else {
       return res.json({ error: `URL not found` });
    }
      
  }

  catch (err) {
    console.error(err);
    res.status(500).json('Server error')
  }
})
