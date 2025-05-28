const fs = require('fs');
const path = require('path');

const envExample = `# Database Configuration
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_SERVER=localhost
DB_NAME=test_db

# JWT Configuration
JWT_SECRET=your-secret-key

# Server Configuration
PORT=3000
NODE_ENV=development
`;

const envTest = `# Database Configuration
DB_USER=sa
DB_PASSWORD=YourStrong!Passw0rd
DB_SERVER=localhost
DB_NAME=test_db

# JWT Configuration
JWT_SECRET=test-secret-key

# Server Configuration
PORT=3000
NODE_ENV=test
`;

// Create .env file if it doesn't exist
if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envExample);
    console.log('Created .env file');
}

// Create .env.test file if it doesn't exist
if (!fs.existsSync('.env.test')) {
    fs.writeFileSync('.env.test', envTest);
    console.log('Created .env.test file');
}

console.log('Environment setup complete!');
console.log('\nTo set up GitHub Secrets, go to your repository settings and add the following secrets:');
console.log('- DB_USER');
console.log('- DB_PASSWORD');
console.log('- DB_SERVER');
console.log('- DB_NAME');
console.log('- JWT_SECRET'); 