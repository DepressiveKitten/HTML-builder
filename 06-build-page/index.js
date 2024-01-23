const fs = require('fs');
const path = require('path');
const { stdout, stdin } = require('process');
const input_dir = __dirname;
const output_dir = path.join(__dirname, 'project-dist');

fs.rm(output_dir, { recursive: true, force: true }, () => {
  fs.mkdir(output_dir, () => {
    copy(path.join(input_dir, 'assets'), path.join(output_dir, 'assets'));
    merge(path.join(input_dir, 'styles'), path.join(output_dir, 'style.css'));
    insert(
      path.join(input_dir, 'template.html'),
      path.join(input_dir, 'components'),
      path.join(output_dir, 'index.html'),
    );
  });
});

function copy(input, output) {
  fs.mkdir(output, () => {
    fs.promises.readdir(input, { withFileTypes: true }).then((files) => {
      for (let file of files) {
        if (file.isDirectory()) {
          copy(path.join(input, file.name), path.join(output, file.name));
        } else {
          fs.promises.copyFile(
            path.join(input, file.name),
            path.join(output, file.name),
          );
        }
      }
    });
  });
}

function merge(input, output) {
  const destination = fs.createWriteStream(output);
  fs.promises.readdir(input, { withFileTypes: true }).then((files) => {
    for (let file of files) {
      if (path.extname(file.name) == '.css') {
        const source = fs.createReadStream(path.join(input, file.name));
        source.on('data', (data) => {
          destination.write(data.toString());
        });
      }
    }
  });
}

function insert(input, insert_input, output) {
  input = fs.createReadStream(input);
  input.on('data', (data) => {
    output = fs.createWriteStream(output);
    data = data.toString();
    fs.promises
      .readdir(insert_input, { withFileTypes: true })
      .then((files) => {
        for (let i = 0;i < files.length;i++) {
          let file = files[i]
          if (file.isDirectory()||path.extname(file.name)!='.html') {
            continue;
          }

          const replaced = '{{'+file.name.replace('.html','')+'}}';

          file = fs.createReadStream(path.join(insert_input, file.name));
          file.on('data',(replacement)=>{
            data = data.replace(replaced, replacement.toString());
            if(i == files.length-1)
            {
              output.write(data);
            }
          })
        }
      });
  });
}
