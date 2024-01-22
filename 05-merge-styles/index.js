const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
const input_dir = path.join(__dirname, 'styles');
const output_dir = path.join(__dirname, 'project-dist/bundle.css');
const output = fs.createWriteStream(output_dir);

fs.promises.readdir(input_dir, { withFileTypes: true }).then((files) => {
  for (let file of files) {
    if (path.extname(file.name) == '.css') {
      const input = fs.createReadStream(path.join(input_dir, file.name));
      input.on('data', (data) => {
        output.write(data.toString());
      });
    }
  }
});
