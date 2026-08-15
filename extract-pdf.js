const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Game design/AI CARD GAME.pdf');

pdf(dataBuffer).then(function (data) {
    console.log("Number of pages:", data.numpages);
    console.log("Text snippet:", data.text.substring(0, 1000));
    fs.writeFileSync('extracted_pdf.txt', data.text);
    console.log("Successfully extracted text to extracted_pdf.txt");
}).catch(err => {
    console.error("Error reading PDF:", err);
});
