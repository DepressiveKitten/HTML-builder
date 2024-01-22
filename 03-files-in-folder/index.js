const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');

fs.promises
  .readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true })
  .then((files) => {
    for (let file of files) {
      if (file.isDirectory()) {
        continue;
      }
      fs.promises
        .stat(path.join(__dirname, 'secret-folder', file.name))
        .then((file_stat) => {
          stdout.write(
            file.name.replace('.', ' - ') + ' - ' + file_stat.size + ' bytes\n',
          );
        });
    }
  });
