const fs = require('fs');

exports.deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) console.error("File deletion error:", err);
    });
};
