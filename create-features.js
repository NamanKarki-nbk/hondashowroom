const fs = require('fs');

const featuresData = {
  eu70is: [
    {"title": "EFI System", "description": "EFI (Electronic Fuel Injection) system for optimized fuel efficiency and easy starting"},
    {"title": "iMonitor Display", "description": "iMonitor digital display providing performance, operational status, and diagnostics"},
    {"title": "Inverter Technology", "description": "Inverter technology providing super-clean power suitable for sensitive electronics"},
    {"title": "Electric Start", "description": "Electric key start with recoil backup for effortless operation"},
    {"title": "Eco-Throttle", "description": "Eco-Throttle system automatically adjusting engine speed to suit load demand"},
    {"title": "Low Noise", "description": "Low noise output with specialized sound-dampening mufflers and enclosure"}
  ],
  eg1000: [
    {"title": "High Fuel Efficiency", "description": "High fuel efficiency powered by a durable 4-stroke engine"},
    {"title": "Compact & Portable", "description": "Compact and highly portable lightweight design"},
    {"title": "Oil Alert System", "description": "Oil Alert system to prevent engine seizure when oil falls below safe levels"},
    {"title": "Circuit Breaker", "description": "Integrated AC circuit breaker for protection against electrical overloads"},
    {"title": "Low-Noise Operation", "description": "Low-noise muffling system for quiet operation"}
  ],
  ep1000: [
    {"title": "AVR Technology", "description": "Automatic Voltage Regulator (AVR) to deliver stable voltage output"},
    {"title": "4-Stroke Engine", "description": "4-stroke technology ensuring clean emissions and high fuel efficiency"},
    {"title": "Oil Alert System", "description": "Oil Alert system for automatic engine protection"},
    {"title": "Circuit Breaker", "description": "Built-in circuit breaker to protect alternator and connected devices"},
    {"title": "Extended Run Time", "description": "Extended run time per fuel tank"}
  ],
  ep1800cx: [
    {"title": "AVR Technology", "description": "Automatic Voltage Regulator (AVR) for smooth power output"},
    {"title": "Large Fuel Tank", "description": "Large fuel tank design providing extended operational hours"},
    {"title": "Fuel Gauge", "description": "Fuel gauge display to monitor tank levels easily"},
    {"title": "Heavy-Duty Frame", "description": "Heavy-duty frame providing structural protection and portability"},
    {"title": "Oil Alert System", "description": "Oil Alert system to protect engine from low oil damage"}
  ],
  eu10i: [
    {"title": "Super-Quiet Operation", "description": "Super-quiet operation suitable for camping and quiet settings"},
    {"title": "Inverter Technology", "description": "Inverter technology for safe use with laptops and delicate devices"},
    {"title": "Eco-Throttle", "description": "Eco-Throttle system for optimized fuel consumption"},
    {"title": "Ultra-Lightweight", "description": "Ultra-lightweight portable suitcase design"},
    {"title": "Parallel Capability", "description": "Parallel capability to link two units together for double power output"}
  ],
  eu22i: [
    {"title": "High Output", "description": "Portable industry flagship delivering up to 2.2 kVA maximum output"},
    {"title": "4-Stroke Engine", "description": "4-Stroke engine advantage for clean operation and high fuel efficiency"},
    {"title": "Inverter Technology", "description": "Inverter voltage regulation providing commercial-grade clean power"},
    {"title": "Eco-Throttle", "description": "Eco-Throttle feature maximizing runtime under partial loads"},
    {"title": "AC/DC Breakers", "description": "AC/DC circuit breakers and battery charging output"}
  ],
  eu30is: [
    {"title": "Electric Start", "description": "Electric self-start option with manual recoil backup"},
    {"title": "Inverter Technology", "description": "Inverter technology providing stable power for sensitive equipment"},
    {"title": "Eco-Throttle", "description": "Eco-Throttle system for high fuel economy and quiet operation"},
    {"title": "Fuel Gauge", "description": "Fuel gauge for continuous fuel level monitoring"},
    {"title": "Oil Alert System", "description": "Oil Alert System preventing engine seizure on low oil"},
    {"title": "Low Noise", "description": "Built-in circuit breaker and specialized muffling for low noise output"},
    {"title": "Trolley Kit", "description": "Integrated 4-wheel trolley kit for easy transport"}
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
