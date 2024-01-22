const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
const input_dir = path.join(__dirname, 'files');
const output_dir = path.join(__dirname, 'files-copy');

fs.rm(output_dir, { recursive: true, force: true }, () => {
  function copy(input, output) {
    fs.mkdir(output, () => {
      fs.promises.readdir(input, { withFileTypes: true }).then((files) => {
        for (let file of files) {
          if (file.isDirectory()) {
            copy(path.join(input, file.name), path.join(output, file.name));
          }
          else{
            fs.promises.copyFile(path.join(input, file.name),path.join(output, file.name));
          }
        }
      });
    });
  }
  copy(input_dir,output_dir);
});
