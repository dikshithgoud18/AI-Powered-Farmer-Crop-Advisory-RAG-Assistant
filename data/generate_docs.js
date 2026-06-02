const fs = require('fs');
const path = require('path');

const topics = [
  "Wheat Cultivation Guide", "Rice Farming Best Practices", "Maize Nutrient Management",
  "Soybean Disease Control", "Cotton Irrigation Strategies", "Tomato Pest Management",
  "Potato Harvesting Techniques", "Onion Storage and Handling", "Garlic Soil Requirements",
  "Carrot Organic Farming", "Cabbage Crop Rotation", "Broccoli Yield Optimization",
  "Spinach Greenhouse Cultivation", "Lettuce Hydroponics", "Pepper Climate Needs",
  "Cucumber Trellising", "Pumpkin Pollination", "Watermelon Watering Schedule",
  "Strawberry Integrated Pest Management", "Apple Tree Pruning", "Orange Grove Maintenance",
  "Banana Fertilization Program", "Mango Blossom Blight Control", "Grapes Vineyard Management",
  "Coffee Shade Tree Selection", "Tea Plucking Intervals", "Cocoa Fermentation Process",
  "Sugarcane Weed Control", "Peanut Soil Health", "Sunflower Seed Production",
  "Canola Sowing Date", "Barley Malting Quality", "Oats Fodder Production",
  "Sorghum Drought Resistance", "Millet Dryland Farming", "Lentil Nitrogen Fixation",
  "Chickpea Seed Treatment", "Peas Intercropping", "Beans Nematode Management",
  "Almond Tree Nutrition", "Walnut Orchard Layout", "Pecan Zinc Deficiency",
  "Cashew Harvesting", "Pistachio Salinity Tolerance", "Coconut Water Management",
  "Rubber Tapping Systems", "Oil Palm Replanting", "Olive Pruning and Training",
  "Avocado Root Rot Control", "Papaya Ringspot Virus Management"
];

const templates = [
  (topic) => `Title: ${topic}\n\nIntroduction:\nThis document provides comprehensive guidelines on ${topic.toLowerCase()}. Effective management is crucial for optimal yield and quality. Farmers should follow the recommended practices tailored to their specific agro-climatic zones.\n\nKey Practices:\n1. Site Selection: Ensure well-drained soil with appropriate pH.\n2. Planting: Use certified seeds and maintain optimal spacing.\n3. Irrigation: Provide adequate moisture, especially during critical growth stages.\n4. Nutrition: Apply balanced fertilizers based on soil test results.\n5. Protection: Monitor regularly for pests and diseases. Implement Integrated Pest Management (IPM) strategies.\n\nConclusion:\nBy adhering to these principles for ${topic.toLowerCase()}, farmers can achieve sustainable and profitable production.`,
  (topic) => `Document Name: ${topic}\n\nOverview:\nIn the realm of modern agriculture, ${topic.toLowerCase()} plays a pivotal role. This manual outlines the essential steps and scientific approaches to maximize efficiency.\n\nDetailed Guidelines:\n- Soil Preparation: Deep ploughing and organic matter incorporation.\n- Sowing/Planting: Adhere to the recommended season and seed rate.\n- Water Management: Drip or sprinkler irrigation is advised to conserve water.\n- Nutrient Application: Split application of Nitrogen is beneficial.\n- Pest & Disease: Early detection is key. Use biological controls where possible.\n\nSummary:\nThe success of ${topic.toLowerCase()} depends on timely interventions and adopting best agricultural practices.`
];

const dataDir = path.join(__dirname, '..', 'documents');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

topics.forEach((topic, index) => {
  const template = templates[index % templates.length];
  const content = template(topic);
  const filename = topic.toLowerCase().replace(/ /g, '_') + '.txt';
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, content);
  console.log(`Generated: ${filename}`);
});

console.log(`Successfully generated ${topics.length} documents in ${dataDir}`);
