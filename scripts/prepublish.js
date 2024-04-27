/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
import copyfiles from 'copyfiles';

const filesToCopy = ['LICENSE', 'CHANGELOG.md', 'README.md'];

const targetPackages = ['packages/client-api-plop'];

targetPackages.forEach((targetPath) => {
  copyfiles([...filesToCopy, targetPath], () => null);
});
