/**
 * Opens the finished static site (index.html).
 * The Next.js app in /app is a leftover scaffold — do not use it as the storefront.
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const indexPath = path.resolve(__dirname, '..', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found:', indexPath);
  process.exit(1);
}

console.log('Opening CHRONOS static site:');
console.log(indexPath);

if (process.platform === 'win32') {
  exec(`cmd /c start "" "${indexPath}"`, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
} else if (process.platform === 'darwin') {
  exec(`open "${indexPath}"`, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
} else {
  exec(`xdg-open "${indexPath}"`, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
}
