const fs = require('fs');
const path = require('path');

const rootDir = __dirname; // Use the current directory
const outputFilePath = path.join(rootDir, 'all_code.txt');
const directories = ['src'];

// Function to get all files recursively from a directory
function getFiles(dir, fileList = []) {
    if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
        console.log(`Directory does not exist: ${dir}`);
        return fileList;
    }

    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);

        if (fs.lstatSync(filePath).isDirectory()) {
            getFiles(filePath, fileList);
        } else if (/\.(js|jsx|tsx|ts|css)$/.test(file)) {
            fileList.push(filePath); // Append to the file list
        }
    });

    return fileList;
}

// Function to copy code from files into the output file
function copyCodeToFile(files, outputFile) {
    const output = fs.createWriteStream(outputFile, { flags: 'w' });

    files.forEach(file => {
        try {
            const fileContent = fs.readFileSync(file, 'utf-8');
            output.write(`\n// --- ${file} ---\n`);
            output.write(fileContent + '\n\n');
        } catch (err) {
            console.log(`Error reading file: ${file}\n${err.message}`);
        }
    });

    output.end();
    console.log(`All code has been copied to ${outputFile}`);
}

// Main execution
const allFiles = [];
directories.forEach(dir => {
    const dirPath = path.join(rootDir, dir);
    console.log(`Checking directory: ${dirPath}`);

    if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
        getFiles(dirPath, allFiles);
    } else {
        console.log(`Directory "${dirPath}" does not exist.`);
    }
});

if (allFiles.length > 0) {
    copyCodeToFile(allFiles, outputFilePath);
} else {
    console.log("No files found in specified directories.");
}
