const fs = require('fs');

const featuresData = {
  f300: [
    {"title": "Compact & Lightweight", "description": "Compact and lightweight structure ideal for narrow garden rows and small plots"},
    {"title": "Easy-Start Engine", "description": "Easy-start GX80 4-stroke overhead valve engine"},
    {"title": "Adjustable Handlebar", "description": "Vertical handlebar height adjustment"},
    {"title": "Deadman Clutch", "description": "Deadman clutch safety lever mechanism"},
    {"title": "Mobility Wheel", "description": "Front wheel kit included for easy mobility across rough ground"}
  ],
  wjr2525t1: [
    {"title": "High-Pressure Pump", "description": "High-pressure plunger pump system delivering steady chemical dispersion"},
    {"title": "Fuel-Efficient Engine", "description": "Fuel-efficient 4-stroke mini engine with low operating sound"},
    {"title": "Large Storage Tank", "description": "Large capacity 25-liter chemical storage tank"},
    {"title": "Ergonomic Harness", "description": "Ergonomic backpack harness with padded straps for field comfort"},
    {"title": "Quick Shut-Off", "description": "Quick shut-off valve pressure system"}
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
