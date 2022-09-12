const fs = require('fs');

const domain = 'confcodeofconduct.com';

fs.readdir(__dirname, (error, files) => {
  const lines = files
    .filter(filename => filename.startsWith('index-'))
    .map(f => {
      return f.replace(/^index-(.*)\.html/, '$1');
    })
    .map(lang => {
      return `https://${lang}.${domain} /index-${lang}.html 200!\nhttp://${lang}.${domain} /index-${lang}.html 200!`;
    });

  fs.writeFileSync(__dirname + '/_redirects', lines.join('\n'), 'utf8');
  console.log('generated _redirects');
});
