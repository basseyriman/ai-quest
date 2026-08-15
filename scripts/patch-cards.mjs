import fs from "fs";

const path = "src/lib/engineer-mode/cards.ts";
let content = fs.readFileSync(path, "utf8");

const descriptions = {
  "Financial Transactions Dataset":
    "Records of financial transactions used to detect spending patterns and fraud.",
  "Banking Records Dataset":
    "Customer banking data used for financial analysis and risk assessment.",
  "Customer Behaviour Dataset":
    "Data showing how customers interact with products and services.",
  "Credit History Dataset":
    "Records of borrowing and repayment behaviour used for credit scoring.",
  "User Behaviour Dataset":
    "Data capturing how users interact with digital platforms.",
  "Customer Reviews Dataset":
    "Ratings and feedback used for sentiment and recommendation analysis.",
  "E-Commerce Purchases Dataset":
    "Online purchase records used to understand buying patterns.",
  "Sales History Dataset":
    "Historical sales data used for forecasting and pricing.",
  "MRI Dataset": "Medical brain scan images used for disease diagnosis.",
  "Medical Records Dataset":
    "Clinical patient information used for healthcare analysis.",
  "Genomic Dataset":
    "Genetic information used for disease prediction and research.",
  "Traffic Sensor Dataset":
    "Traffic measurements used to monitor vehicle movement.",
  "Camera Image Dataset":
    "Image data used for computer vision applications.",
  "LiDAR Dataset": "3D spatial data used for navigation and mapping.",
  "GPS Dataset": "Location tracking data used for movement prediction.",
  "Climate Records Dataset":
    "Historical environmental data used for climate forecasting.",
  "Satellite Imagery Dataset":
    "Earth observation images used for environmental monitoring.",
  "Environmental Sensor Dataset":
    "Sensor readings measuring environmental conditions.",
  "Energy Consumption Dataset": "Records showing energy usage patterns.",
  "Smart Meter Dataset":
    "Real-time electricity usage data from smart meters.",
  "IoT Sensor Dataset": "Data collected from connected smart devices.",
  "Social Media Posts Dataset":
    "User-generated content collected from social platforms.",
  "Text Corpus Dataset": "Large collections of text used for language models.",
  "Voice Recordings Dataset":
    "Audio recordings used for speech recognition systems.",
  "Speech Corpus Dataset": "Structured speech data used for voice AI training.",
  "Customer Service Calls Dataset":
    "Recorded customer conversations used for support analytics.",
  "Customer Support Conversations Dataset":
    "Chat and support interactions used for chatbot training.",
  "Product Knowledge Base Dataset":
    "Structured product information used for intelligent assistance.",
  "Support Tickets Dataset":
    "Customer issue reports used for support automation.",
  "Cybersecurity Logs Dataset":
    "Security event records used for threat detection.",
  "Network Traffic Dataset":
    "Network communication data used for cybersecurity analysis.",
  "Security Event Dataset":
    "Records of detected security incidents and alerts.",
  "Facial Image Dataset":
    "Face images used for recognition and verification systems.",
  "CCTV Dataset": "Surveillance footage used for monitoring and detection.",
  "Video Frame Dataset":
    "Extracted video images used for computer vision tasks.",
  "Camera Traffic Dataset": "Road camera footage used for traffic analysis.",
  "Candidate CV Dataset": "Applicant resumes used for recruitment analysis.",
  "Job Application Dataset":
    "Employment application records used for candidate evaluation.",
  "Interview Feedback Dataset":
    "Interview assessment data used for recruitment decisions.",
};

for (const [name, desc] of Object.entries(descriptions)) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(
    `("name": "${escaped}",\\s*"category": "DATA COLLECTION",\\s*"description": ")[^"]*(")`,
    "g"
  );
  content = content.replace(re, `$1${desc}$2`);
}

const nameFixes = [
  ["PCA (Principal Component Analysis)", "PCA"],
  ["KNN (K-Nearest Neighbours)", "KNN"],
  ["CNN (Convolutional Neural Network)", "CNN"],
  ["LSTM (Long Short-Term Memory)", "LSTM"],
];
for (const [oldName, newName] of nameFixes) {
  content = content.replaceAll(`"name": "${oldName}"`, `"name": "${newName}"`);
}

fs.writeFileSync(path, content);
console.log("Patched cards.ts");
