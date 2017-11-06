const pdfDoc = require('pdfkit');
const fs = require ('fs');

doc = new pdfDoc;

let receipt = doc.pipe(fs.createWriteStream('output.pdf'));

doc.font("C:\\Windows\\Fonts\\Arial.ttf")
.fontSize(25)
.text('Here are some Useless Graphics', 100, 100);

doc.image("C:\\Users\\User\\Pictures\\JKUAT\ Logo.jpg", 250,25,{width:75},{height:75});


doc.end();
