# Node-Scraper 

- First, make sure you have Node.js installed on your computer.

- Create a new directory for your project and navigate to it in your terminal.

- Initialize a Node.js project:
```npm init -y```


- Install the required libraries:
```npm install axios cheerio body-parser express```

Create a Javascript file named scraper.js
 

```const express = require('express');
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
```

Now create a directory public and inside it file index.html and script.js

index.html

 

```<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Scraper</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto p-8 bg-white rounded-lg shadow-md">
        <h1 class="text-3xl font-semibold mb-6">Web Scraper</h1>
        <div class="flex mb-4">
            <input type="text" id="url" placeholder="https://example.com" class="flex-grow border rounded-md p-2 mr-2">
            <button id="scrapeButton" class="bg-blue-500 text-white py-2 px-4 rounded-md transition duration-300 hover:bg-blue-600">Scrape Website</button>
        </div>
        <p id="statusMessage" class="text-red-500 mb-4"></p>
        <div id="scrapedContent" class="bg-gray-200 p-4 rounded-lg"></div>
        <p id="imageCount" class="text-green-500 font-semibold mt-4"></p>
    </div>
    <script src="script.js"></script>
</body>
</html>
```


Script.js

 

```document.addEventListener('DOMContentLoaded', () => {
    const scrapeButton = document.getElementById('scrapeButton');
    const urlInput = document.getElementById('url');
    const statusMessage = document.getElementById('statusMessage');
    const scrapedContent = document.getElementById('scrapedContent');
    const imageCountElement = document.getElementById('imageCount');
  
    scrapeButton.addEventListener('click', async () => {
      const url = urlInput.value;
  
      if (!url) {
        statusMessage.textContent = 'Please enter a URL.';
        return;
      }
  
      // Send the URL to the backend for scraping
      const response = await fetch(`/scrape?url=${url}`);
      const data = await response.json();
  
      if (data.success) {
        statusMessage.textContent = 'Website scraped successfully.';
        
        // Replace image placeholders with actual image elements
        scrapedContent.innerHTML = data.content;
        
        // Display image count
        imageCountElement.textContent = `Images found: ${data.images.length}`;
      } else {
        statusMessage.textContent = 'Error scraping website.';
      }
    });
  });
  
 ```

Now run the project from terminal 

```node scraper.js ```

 

You can deploy it on render . com

 

Github Link : https://github.com/Ajinkgupta/Node-Scraper

Deployed Link : https://nodescraper.onrender.com/
