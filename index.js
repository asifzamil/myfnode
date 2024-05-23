const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define a route for the home page
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

// Define a route to handle form submissions and scrape data
app.post('/submit', async (req, res) => {
  const refNo = req.body.refNo;
  const url = `https://bill.pitc.com.pk/gepcobill/general?refno=${refNo}`;

  try {
    // Fetch the webpage
    const { data } = await axios.get(url);

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Scrape the necessary data (this will depend on the page structure)
    const billDetails = {}; // Initialize an object to store the bill details

    // Example of scraping specific data
    billDetails.name = $('.maintable').text();
    billDetails.amount = $('#billAmount').text();
    // Add more fields as needed based on the page structure

    // Render the bill details on a new page
    res.render('bill', { billDetails: billDetails });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving bill data');
  }
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
