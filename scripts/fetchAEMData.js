const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Read .env file manually since dotenv is not installed
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

// Function to recursively find and download images
const processImages = async (obj, authHeader) => {
  if (!obj) return;
  
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('/content/dam/')) {
      const aemImagePath = obj[key];
      const localImagePath = `/images/dam/${path.basename(aemImagePath)}`;
      const fullLocalPath = path.join(__dirname, '../public', localImagePath);
      
      // Ensure directory exists
      const dir = path.dirname(fullLocalPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Download image from AEM Publish (localhost:4503)
      try {
        console.log(`Downloading image: ${aemImagePath}...`);
        const imgResponse = await axios.get(`http://localhost:4503${aemImagePath}`, {
          responseType: 'stream',
          headers: { 'Authorization': authHeader }
        });
        
        const writer = fs.createWriteStream(fullLocalPath);
        imgResponse.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        
        // Update the JSON to point to the local public folder!
        obj[key] = localImagePath;
        console.log(`Saved image to ${localImagePath}`);
      } catch (err) {
        console.error(`Failed to download ${aemImagePath}:`, err.message);
      }
    } else if (typeof obj[key] === 'object') {
      await processImages(obj[key], authHeader);
    }
  }
};

const fetchAEMData = async () => {
  try {
    const url = `http://localhost:4503/content/fashionstore/us/en/home.homedata`;
    const username = process.env.REACT_APP_AEM_USER || 'admin';
    const password = process.env.REACT_APP_AEM_PASS || 'admin';
    const auth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    console.log(`Fetching JSON from ${url}...`);

    const response = await axios.get(url, {
      headers: { 'Authorization': auth }
    });

    const jsonData = response.data;
    
    // Download any images found in the JSON
    await processImages(jsonData, auth);

    const filePath = path.join(__dirname, '../src/data/aemData.json');
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.log(`Successfully wrote AEM JSON data to ${filePath}`);
    console.log(`🎉 100% Static Setup Complete! Vercel is ready.`);
  } catch (error) {
    console.error('Error fetching AEM data:', error.message);
  }
};

fetchAEMData();
