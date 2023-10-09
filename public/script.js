document.addEventListener('DOMContentLoaded', () => {
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
  