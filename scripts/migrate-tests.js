#!/usr/bin/env node

/**
 * Migration script to update test files from Jest-specific APIs to framework-agnostic APIs
 */

const fs = require('fs');
const path = require('path');

// Mapping of Jest APIs to framework-agnostic imports
const API_MAPPINGS = {
    'jest.fn()': "{ testFn } from 'ant-design-testing'; // Replace jest.fn() with testFn()",
    'jest.useFakeTimers()':
        "{ useFakeTimers } from 'ant-design-testing'; // Replace jest.useFakeTimers() with useFakeTimers()",
    'jest.useRealTimers()':
        "{ useRealTimers } from 'ant-design-testing'; // Replace jest.useRealTimers() with useRealTimers()",
    'jest.runAllTimers()':
        "{ runAllTimers } from 'ant-design-testing'; // Replace jest.runAllTimers() with runAllTimers()",
    'jest.advanceTimersByTime':
        "{ advanceTimersByTime } from 'ant-design-testing'; // Replace jest.advanceTimersByTime with advanceTimersByTime",
    'jest.spyOn': "{ spyOn } from 'ant-design-testing'; // Replace jest.spyOn with spyOn",
};

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

function updateTestFile(filePath) {
    console.log(`Processing: ${filePath}`);

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const imports = new Set();

    // Check which APIs are used and collect needed imports
    for (const [jestApi, importInfo] of Object.entries(API_MAPPINGS)) {
        if (content.includes(jestApi)) {
            const match = importInfo.match(/{ (.+?) }/);
            if (match) {
                imports.add(match[1]);
            }
        }
    }

    // Add import statement if needed
    if (imports.size > 0) {
        const importStatement = `import { ${Array.from(imports).join(', ')} } from 'ant-design-testing';`;

        // Find existing imports section
        const lines = content.split('\n');
        let insertIndex = 0;

        // Find the last import statement
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().startsWith('import ')) {
                insertIndex = i + 1;
            } else if (lines[i].trim() === '' && insertIndex > 0) {
                break;
            }
        }

        // Check if import already exists
        if (!content.includes(importStatement)) {
            lines.splice(insertIndex, 0, importStatement);
            content = lines.join('\n');
            modified = true;
        }
    }

    // Replace Jest APIs with framework-agnostic versions
    const replacements = [
        [/jest\.fn\(\)/g, 'testFn()'],
        [/jest\.useFakeTimers\(\)/g, 'useFakeTimers()'],
        [/jest\.useRealTimers\(\)/g, 'useRealTimers()'],
        [/jest\.runAllTimers\(\)/g, 'runAllTimers()'],
        [/jest\.advanceTimersByTime/g, 'advanceTimersByTime'],
        [/jest\.spyOn/g, 'spyOn'],
    ];

    for (const [pattern, replacement] of replacements) {
        const newContent = content.replace(pattern, replacement);
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Updated: ${filePath}`);
    } else {
        console.log(`⚪ No changes: ${filePath}`);
    }

    return modified;
}

function updateSetupTests() {
    const setupTestsPath = path.join(__dirname, '../tests/setupTests.ts');

    if (fs.existsSync(setupTestsPath)) {
        console.log(`Processing setup file: ${setupTestsPath}`);

        const content = fs.readFileSync(setupTestsPath, 'utf8');

        // Replace jest.fn() in setupTests.ts
        const newContent = content.replace(
            /jest\.fn\(/g,
            "(() => { const { testFn } = require('ant-design-testing'); return testFn; })()("
        );

        if (newContent !== content) {
            fs.writeFileSync(setupTestsPath, newContent, 'utf8');
            console.log(`✅ Updated setup file: ${setupTestsPath}`);
        }
    }
}

function main() {
    console.log('🚀 Starting test file migration...\n');

    const srcDir = path.join(__dirname, '../src');
    const testFiles = findTestFiles(srcDir);

    console.log(`Found ${testFiles.length} test files\n`);

    let updatedCount = 0;

    for (const file of testFiles) {
        if (updateTestFile(file)) {
            updatedCount++;
        }
    }

    // Update setup tests
    updateSetupTests();

    console.log(`\n✨ Migration completed!`);
    console.log(`📊 Updated ${updatedCount} out of ${testFiles.length} test files`);
    console.log(`\n🔧 Next steps:`);
    console.log(`1. Review the changes and test with Jest`);
    console.log(`2. Configure Vitest and test compatibility`);
    console.log(`3. Update documentation`);
}

if (require.main === module) {
    main();
}

module.exports = { updateTestFile, findTestFiles };
