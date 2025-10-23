
import mongoose from 'mongoose';
import { Country } from "../models/country.model.js"
import { connectDB } from "../lib/db.js";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import { fileURLToPath } from 'url';

// Setup __dirname (ESM style)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Add country name and country code at `countries.json` for every country you want to Add to Store and migrate it to DB.
// or even you can add state or governorate of  country if you  work locally in specific country.
const countries = JSON.parse(fs.readFileSync('./countries.json', 'utf-8'));

async function seedCountries() {
  try {

    connectDB();
    for (const country of countries) {
      await Country.updateOne(
        { name: country.name },
        {
          $set: {
            name: country.name,
            code: country.code,
          },
        },
        { upsert: true }
      );
    }

  console.log('Countries seeded successfully');
  } catch (err) {
    console.error(' Seeding error:', err);
  } finally {
     await mongoose.disconnect();
    process.exit();
  }
}

seedCountries();
