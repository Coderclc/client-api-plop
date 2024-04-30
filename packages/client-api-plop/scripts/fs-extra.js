import fs from 'fs-extra';

const filesToCopy = [
  {
    folder: 'entry',
    file: 'api.hbs',
  },
  {
    folder: 'custom',
    file: 'lambda.hbs',
  },
  {
    folder: 'custom',
    file: 'lib.hbs',
  },
];

filesToCopy.forEach(({ folder, file }) => {
  fs.copy(`src/${folder}/${file}`, `lib/${folder}/${file}`);
});
