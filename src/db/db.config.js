const mongoose = require('mongoose');
const express = require('express');
const dotenv = require('dotenv');

require('dotenv').config();

const dbMain = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    mongoose.connect(
      'mongodb+srv://r:f@cluster0.h1xl8c4.mongodb.net/arya?retryWrites=true&w=majority',
    );
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
