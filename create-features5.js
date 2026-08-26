const fs = require('fs');

const featuresData = {
  wjr4025t: [
    {"title": "High-Power Engine", "description": "Higher horsepower 35.8cc engine designed for high-reach spraying and larger coverage"},
    {"title": "Heavy-Duty Pump", "description": "Heavy-duty plunger pump producing up to 4.0 MPa shut-off valve pressure"},
    {"title": "Resin Chemical Tank", "description": "25-liter chemical tank constructed with chemical-resistant resin"},
    {"title": "Comfort-Fit Frame", "description": "Comfort-fit frame structure easing weight distribution on the operator's back"},
    {"title": "Low Vibration Layout", "description": "Low vibration engine mount layout"}
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
