const fs = require('fs');

const featuresData = {
  umr435t: [
    {"title": "Backpack Flexible Shaft", "description": "Backpack flexible shaft design transferring weight to shoulders and back"},
    {"title": "Ergonomic Loop Handle", "description": "Ergonomic loop handle with fine trigger throttle control"},
    {"title": "Heavy-Duty Harness", "description": "Padded back supporter and heavy-duty harness system for extended field use"},
    {"title": "360-Degree Inclination", "description": "360-degree engine inclination capability"},
    {"title": "Low Vibration", "description": "Low vibration transmission easing strain during heavy clearing"}
  ],
  fq650: [
    {"title": "Complete Weeding Solution", "description": "Complete weeding and tilling solution for horticulture farming"},
    {"title": "Flexible Rotor", "description": "Flexible rotor (tyne assembly) adjustable for various field widths"},
    {"title": "Adjustable Handlebar", "description": "Vertical and horizontal handlebar adjustments accommodating different user heights"},
    {"title": "Foldable Design", "description": "Foldable design for transport and storage"},
    {"title": "Low Vibration Steering", "description": "Low vibration, lightweight steering designed to be user and woman-friendly"},
    {"title": "Front Transport Wheel", "description": "Front transport wheel included"}
  ]
};

Object.keys(featuresData).forEach(key => {
  const fileContent = {
    features: featuresData[key].map((item, index) => ({
      title: item.title,
      description: item.description,
      image: `/models/hero-${(index % 2) + 1}.png`
    }))
  };
  fs.writeFileSync(`/mnt/data/Naman/honda-showroom/lib/data/${key}Features.json`, JSON.stringify(fileContent, null, 2));
});

console.log("Features generated successfully");
