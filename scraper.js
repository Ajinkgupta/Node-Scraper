const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Function to scrape a website and extract image URLs
async function scrapeWebsite(url) {
  try {
    // Fetch the HTML content of the provided URL
    const response = await axios.get(url);
    const html = response.data;

    // Load the HTML content into Cheerio for parsing
    const $ = cheerio.load(html);

    // Extract the text content from the website
    const websiteContent = $('body').html(); // Use .html() to preserve image tags

    // Extract image URLs
    const imageUrls = $('img').map((index, element) => $(element).attr('src')).get();

    // Store the scraped content in local storage
    fs.writeFileSync('scraped_website.html', websiteContent);

    return { success: true, content: websiteContent, images: imageUrls };
  } catch (error) {
    console.error('Error scraping website:', error);
    return { success: false };
  }
}

// Handle GET requests for scraping
app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.json({ success: false });
  } else {
    const result = await scrapeWebsite(url);
    res.json(result);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
