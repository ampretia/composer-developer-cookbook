const fs = require('fs')

const imghash = require('imghash');

var imgFile = fs.readFileSync('image.jpg')
var imgStr = imgFile.toString('base64');



imghash
  .hash(Buffer.from(imgStr,'base64'))
  .then((hash) => {
    console.log(hash); // 'f884c4d8d1193c07'
  });