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

const fetchAEMData = async () => {
  try {
    // We can just hit localhost:4502 directly since this script runs locally! No ngrok needed.
    const url = `http://localhost:4502/content/fashionstore/us/en/home.homedata`;
    const username = process.env.REACT_APP_AEM_USER || 'admin';
    const password = process.env.REACT_APP_AEM_PASS || 'admin';
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    console.log(`Fetching from ${url}...`);

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    const filePath = path.join(__dirname, '../src/data/aemData.json');
    // ensure dir exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
    console.log(`Successfully wrote AEM data to ${filePath}`);
  } catch (error) {
    console.error('Error fetching AEM data:', error.message);
    if (error.response) {
       console.error(error.response.data);
    }
  }
};

fetchAEMData();
