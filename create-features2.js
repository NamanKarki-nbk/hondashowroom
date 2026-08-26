const fs = require('fs');

const featuresData = {
  hhh25d75ut: [
    {"title": "360-Degree Inclinable Engine", "description": "360-degree inclinable 4-stroke GX25 engine allowing operation at any angle"},
    {"title": "Adjustable Handle", "description": "180-degree 3-way adjustable handle for ergonomic horizontal and vertical trimming"},
    {"title": "Dual-Blade System", "description": "Dual-blade double-sided cutting system for fast and precise cuts"},
    {"title": "Anti-Vibration Mounts", "description": "Anti-vibration engine mounts reducing operator fatigue"},
    {"title": "Easy Recoil Starting", "description": "Easy recoil starting system"}
  ],
  hru216: [
    {"title": "Large Hard Catcher", "description": "Large durable 70-liter hard Dacron catcher reducing stopping frequency"},
    {"title": "Mulching Functionality", "description": "Mulching functionality for efficient grass fertilization"},
    {"title": "Swing Back Blade", "description": "Swing back blade cutting system delivering professional finish and protecting engine shaft"},
    {"title": "Blade Brake Technology", "description": "Blade Brake technology stopping blades within 3 seconds of releasing handle while engine runs"},
    {"title": "Adjustable Height", "description": "11-stage cutting height adjustment lever"},
    {"title": "Deck Wash Port", "description": "Deck wash port and foldable handle for quick storage"}
  ],
  hru196: [
    {"title": "Aluminum Alloy Deck", "description": "Durable rust-proof aluminum alloy chassis deck"},
    {"title": "Engine Brake", "description": "Engine brake safety mechanism"},
    {"title": "Mulching Plug", "description": "Mulching plug option included alongside 54-liter Dacron bag catcher"},
    {"title": "Snorkel Air Intake", "description": "Snorkel air intake system extending engine life in dusty conditions"},
    {"title": "Deck Wash Port", "description": "Deck wash port for effortless cleanup after use"}
  ],
  wv30d: [
    {"title": "GX160 Engine", "description": "Commercial-grade GX160 OHV 4-stroke engine for reliable continuous output"},
    {"title": "High-Capacity Ports", "description": "High-capacity 3-inch suction and discharge ports delivering 1100 L/min"},
    {"title": "Durable Impeller", "description": "Durable cast iron impeller and volute casing for wear resistance"},
    {"title": "Protective Frame", "description": "Protective frame design easing transport and field placement"}
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
