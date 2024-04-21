
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;


mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.get('/initialize-database', async (req, res) => {
  try {
   
    const apiUrl = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
    const response = await axios.get(apiUrl);
    const seedData = response.data;

   
    const SeedModel = mongoose.model('SeedData', new mongoose.Schema({}));
    await SeedModel.deleteMany({}); 
    await SeedModel.insertMany(seedData);

    res.status(200).json({ message: 'Database initialized with seed data.' });
  } catch (error) {
    console.error( error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
