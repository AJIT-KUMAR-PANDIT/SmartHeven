// increaseMemory.js
const { exec } = require('child_process');

// Function to increase memory limit for Node.js
function increaseMemoryLimit(size) {
  // Restart the Node.js process with increased memory limit
  exec(`node --max-old-space-size=${size} your-app.js`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error increasing memory limit: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

// Example usage: increase memory limit to 4GB
increaseMemoryLimit(4096);
