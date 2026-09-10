import dotenv from "dotenv";
import mongoose from "mongoose";
import DBconnect from "./lib/db.js";
import Property from "./models/Property.js";
import { initialPropertyDataset } from "./data/propertyDataset.js";

dotenv.config();

const seed = async () => {
  try {
    await DBconnect();
    console.log("Database connected for seeding...");
    
    // Clear existing properties and seed new ones
    await Property.deleteMany({});
    console.log("Existing properties cleared.");

    const inserted = await Property.insertMany(initialPropertyDataset);
    console.log(`Successfully seeded ${inserted.length} properties dynamically into MongoDB.`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();

