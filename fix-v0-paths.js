#!/usr/bin/env node

/**
 * 🔧 Fix V0 Paths Script
 * Updates v0-routes.ts to use multiple path fallbacks for better file resolution
 */

const fs = require('fs');
const path = require('path');

const v0RoutesPath = 'src/routes/v0-routes.ts';

// Read the current v0-routes.ts file
const currentContent = fs.readFileSync(v0RoutesPath, 'utf8');

// Create the improved file loading logic with multiple path fallbacks
const improvedFileLoading = `
      // Try to load the data file using fs.readFileSync with multiple path fallbacks
      let data;
      try {
        // Try multiple possible paths for the data file
        const possiblePaths = [
          path.join(__dirname, '../data', filename),
          path.join(__dirname, '../../data', filename),
          path.join(__dirname, 'data', filename),
          path.join(__dirname, '..', 'src', 'data', filename),
          path.join(__dirname, 'src', 'data', filename)
        ];

        let fileFound = false;
        let filePath = '';

        for (const tryPath of possiblePaths) {
          if (fs.existsSync(tryPath)) {
            try {
              const fileContent = fs.readFileSync(tryPath, 'utf8');
              data = JSON.parse(fileContent);
              fileFound = true;
              filePath = tryPath;
              console.log(\`✅ Data loaded from: \${tryPath}\`);
              break;
            } catch (error) {
              console.error(\`❌ Error reading \${tryPath}:\`, error);
            }
          }
        }

        if (!fileFound) {
          console.error('❌ Data file not found in any of the expected locations:', possiblePaths);
          return res.status(404).json({ 
            success: false,
            message: 'Data file not found',
            error: \`File \${filename} does not exist\`,
            timestamp: new Date().toISOString(),
            debug: {
              __dirname,
              possiblePaths
            }
          });
        }
        
      } catch (fileError) {
        console.error(\`❌ /v0/ Error reading \${filename}:\`, fileError);
        return res.status(500).json({ 
          success: false,
          message: 'Failed to load data',
          error: 'Could not load data',
          details: fileError instanceof Error ? fileError.message : 'Unknown file error',
          timestamp: new Date().toISOString()
        });
      }`;

// Replace the old file loading logic with the improved version
const oldFileLoadingPattern = /\/\/ Try to load the data file using fs\.readFileSync for better error handling[\s\S]*?} catch \(fileError\) {[\s\S]*?}[\s\S]*?}/;

const updatedContent = currentContent.replace(oldFileLoadingPattern, improvedFileLoading);

// Write the updated file
fs.writeFileSync(v0RoutesPath, updatedContent);

console.log('✅ Updated v0-routes.ts with improved file path resolution');
console.log('📝 Changes made:');
console.log('   - Added multiple path fallbacks for data files');
console.log('   - Improved error handling and debugging');
console.log('   - Added console logging for successful file loads');

// Create a backup
const backupPath = 'src/routes/v0-routes.ts.backup';
fs.writeFileSync(backupPath, currentContent);
console.log(`💾 Backup created at: ${backupPath}`); 