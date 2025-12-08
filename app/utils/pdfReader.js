const fs = require('fs');
const pdf = require('pdf-parse');

exports.readPdfText = async (filePath) => {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
};
