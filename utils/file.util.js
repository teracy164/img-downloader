const fs = require('fs');

class FileUtil {
    writeFile(filePath, body) {
        fs.writeFileSync(filePath, body, 'binary');
    }

    makeDir(dirPath) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    removeDir(dirPath) {
        fs.rmdirSync(dirPath, { recursive: true });
    }
}

module.exports = new FileUtil();