// Quick test to verify MongoDB connection
const { connectDB, closeDB } = require('../db');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('✔ Connection successful!');
    await closeDB();
    console.log('✔ Connection closed properly');
    process.exit(0);
  } catch (error) {
    console.error('✘ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
