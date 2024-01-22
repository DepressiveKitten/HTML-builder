const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
stdout.write('enter text \n');
const output = fs.createWriteStream(path.join(__dirname, 'output.txt'));
stdin.on('data', (data) => {
  data = data.toString();
  if (data.trim() == 'exit') {
    process.emit('SIGINT');
  }

  output.write(data);
});

process.on('SIGINT', () => {
  stdout.write('goodbye cruel world');
  process.exit();
});
