#!/usr/bin/env node

/**
 * Fix test imports to use relative imports instead of package name
 */

const fs = require('fs');
const path = require('path');

function findTestFiles(dir) {
    const files = [];
    const entries = fs.readdirSync(dir);

    for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist') {
            files.push(...findTestFiles(fullPath));
        } else if (entry.endsWith('.test.tsx') || entry.endsWith('.test.ts')) {
            files.push(fullPath);
        }
    }

    return files;
}

function fixTestFile(filePath) {
    console.log(`Processing: ${filePath}`);

    const content = fs.readFileSync(filePath, 'utf8');

    // Replace import from 'ant-design-testing' with relative import
    const newContent = content.replace(
        /import\s*{([^}]+)}\s*from\s*'ant-design-testing';/g,
        "import { $1 } from '../../testFramework';"
    );

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
        return true;
    } else {
        console.log(`⚪ No changes: ${filePath}`);
        return false;
    }
}

function main() {
    console.log('🔧 Fixing test imports...\n');

    const srcDir = path.join(__dirname, '../src');
    const testFiles = findTestFiles(srcDir);

    console.log(`Found ${testFiles.length} test files\n`);

    let updatedCount = 0;

    for (const file of testFiles) {
        if (fixTestFile(file)) {
            updatedCount++;
        }
    }

    console.log(`\n✨ Import fix completed!`);
    console.log(`📊 Updated ${updatedCount} out of ${testFiles.length} test files`);
}

if (require.main === module) {
    main();
}

module.exports = { fixTestFile, findTestFiles };
