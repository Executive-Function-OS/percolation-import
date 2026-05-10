const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../public/data/rescuetime-n1.csv');

const ACTIVITIES = [
  { activity: 'github.com', category: 'Software Development', productivity: 2 },
  { activity: 'VS Code', category: 'Software Development', productivity: 2 },
  { activity: 'terminal', category: 'Software Development', productivity: 2 },
  { activity: 'slack.com', category: 'Communication', productivity: 0 },
  { activity: 'mail.google.com', category: 'Communication', productivity: 0 },
  { activity: 'youtube.com', category: 'Entertainment', productivity: -2 },
  { activity: 'twitter.com', category: 'Social Media', productivity: -2 },
  { activity: 'docs.google.com', category: 'Reference & Learning', productivity: 1 },
  { activity: 'stackoverflow.com', category: 'Reference & Learning', productivity: 1 },
];

function randomActivity() {
  const r = Math.random();
  if (r < 0.4) return ACTIVITIES[1]; // VS Code heavily weighted
  if (r < 0.5) return ACTIVITIES[0]; // GitHub
  if (r < 0.6) return ACTIVITIES[2]; // terminal
  if (r < 0.75) return ACTIVITIES[3]; // slack
  if (r < 0.8) return ACTIVITIES[8]; // stackoverflow
  return ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
}

const START_DATE = new Date();
START_DATE.setMonth(START_DATE.getMonth() - 3);

let csv = 'Date,Time,Activity,Category,Productivity,Time Spent (seconds)\n';

let currentTime = START_DATE.getTime();
const END_TIME = new Date().getTime();

let currentCluster = 'focus'; // 'focus', 'scattered', 'offline'
let clusterRemaining = 0;

function pad(n) {
  return n.toString().padStart(2, '0');
}

while (currentTime < END_TIME) {
  if (clusterRemaining <= 0) {
    const r = Math.random();
    if (r < 0.6) {
      currentCluster = 'focus';
      clusterRemaining = 3600 * 1000 * (1 + Math.random() * 3); // 1-4 hours
    } else if (r < 0.8) {
      currentCluster = 'scattered';
      clusterRemaining = 3600 * 1000 * (0.5 + Math.random() * 2); // 0.5-2.5 hours
    } else {
      currentCluster = 'offline';
      clusterRemaining = 3600 * 1000 * (2 + Math.random() * 10); // 2-12 hours
    }
  }

  if (currentCluster === 'offline') {
    currentTime += clusterRemaining;
    clusterRemaining = 0;
    continue;
  }

  let act;
  let duration;
  if (currentCluster === 'focus') {
    act = randomActivity();
    if (act.category !== 'Software Development') {
      if (Math.random() < 0.8) act = ACTIVITIES[1]; // force VS code
    }
    duration = 300 + Math.random() * 1200; // 5-25 mins per log
  } else {
    // scattered
    act = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
    duration = 30 + Math.random() * 300; // 30s - 5m
  }

  const d = new Date(currentTime);
  const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const timeStr = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  
  csv += `${dateStr},${timeStr},${act.activity},${act.category},${act.productivity},${Math.floor(duration)}\n`;

  currentTime += duration * 1000;
  clusterRemaining -= duration * 1000;
}

fs.writeFileSync(OUTPUT_FILE, csv);
console.log('Successfully generated public/data/rescuetime-n1.csv');
