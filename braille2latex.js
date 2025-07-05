    #!/usr/bin/env node
    
    const fs = require('fs');
    const { exec } = require('child_process');

    console.log('Hello from Node.js shell script!');

    // Example: Read a file
    fs.readFile('example.txt', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      console.log('Content of example.txt:', data);
    });

    // Example: Execute a shell command
    exec('ls -l', (err, stdout, stderr) => {
      if (err) {
        console.error('Error executing command:', err);
        return;
      }
      if (stderr) {
        console.error('Command stderr:', stderr);
      }
      console.log('Command stdout:', stdout);
    });