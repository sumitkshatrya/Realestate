import mongoose from "mongoose";

const aboutContentSchema = new mongoose.Schema(
  {
    // Using a singleton pattern to ensure only one document for this content
    singleton: {
      type: String,
      default: "about",
      unique: true,
      required: true,
    },
    subtitle: {
      type: String,
      default: "About Us",
    },
    title: {
      type: String,
      default: "Expertise with the calm of a private advisor.",
    },
    paragraph: {
      type: String,
      default:
        "For more than two decades, we have shaped residential experiences that balance architecture, neighborhood character, and long-term value. Every recommendation is filtered through how people actually want to live, invest, and grow.",
    },
    features: {
      type: [String],
      default: ["Design-forward developments", "Transparent acquisition guidance", "End-to-end transaction support", "Long-term value strategy"],
    },
    // New fields for the detailed about page
    storyTitle: {
      type: String,
      default: "Our Journey",
    },
    storyContent: {
      type: String,
      default: "Founded over two decades ago, our firm was born from a desire to merge architectural innovation with real-world livability. We started with a small team of passionate real estate professionals and have grown into a leading name in curated city living, always staying true to our core values of transparency, quality, and client-centric service.",
    },
    missionStatement: {
      type: String,
      default: "To empower clients with expert guidance and access to exceptional properties, creating long-term value and fostering vibrant communities.",
    },
    visionStatement: {
      type: String,
      default: "To be the most trusted and innovative real estate advisory in the region, known for our design-forward approach and unwavering commitment to client success.",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AboutContent", aboutContentSchema);