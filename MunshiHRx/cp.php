<?php

$rootDir = __DIR__; // Use the current directory
$outputFilePath = $rootDir . DIRECTORY_SEPARATOR . 'all_code.txt';
$directories = ['src'];

// Function to get all files recursively from a directory
function getFiles($dir, &$fileList) {
    if (!is_dir($dir)) {
        echo "Directory does not exist: {$dir}\n";
        return $fileList;
    }

    $files = scandir($dir);

    foreach ($files as $file) {
        if ($file === '.' || $file === '..') continue;

        $filePath = $dir . DIRECTORY_SEPARATOR . $file;

        if (is_dir($filePath)) {
            getFiles($filePath, $fileList);
        } elseif (preg_match('/\.(js|jsx|tsx|ts|css)$/', $file)) {
            $fileList[] = $filePath; // Append to the file list
        }
    }
    return $fileList;
}

// Function to copy code from files into the output file
function copyCodeToFile($files, $outputFile) {
    $output = fopen($outputFile, 'w');
    if (!$output) { // Check if the file was opened successfully
        die("Could not open output file: " . $outputFile . "\n");
    }

    foreach ($files as $file) {
        $fileContent = file_get_contents($file);
        if ($fileContent === false) { // Check if file_get_contents was successful
            echo "Error reading file: " . $file . "\n";
            continue; // Skip to the next file
        }
        fwrite($output, "\n// --- " . $file . " ---\n");
        fwrite($output, $fileContent . "\n\n");
    }

    fclose($output);
    echo "All code has been copied to {$outputFile}\n";
}

// Main execution
$allFiles = [];
foreach ($directories as $dir) {
    $dirPath = $rootDir . DIRECTORY_SEPARATOR . $dir;
    echo "Checking directory: {$dirPath}\n";
    if (is_dir($dirPath)) {
        getFiles($dirPath, $allFiles);
    } else {
        echo "Directory \"{$dirPath}\" does not exist.\n";
    }
}

if (count($allFiles) > 0) {
    copyCodeToFile($allFiles, $outputFilePath);
} else {
    echo "No files found in specified directories.\n";
}

?>
