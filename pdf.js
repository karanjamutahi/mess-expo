const pdfDoc = require('pdfkit');
const fs = require ('fs');

let doc = new pdfDoc;
let time = new Date().getHours() + ":" + new Date().getMinutes(); 
let date = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear();

let receipt = doc.pipe(fs.createWriteStream('output.pdf'));

doc.font("C:\\Windows\\Fonts\\Arial.ttf")
.fontSize(25)
.text('JKUAT MESS - LUNCH - '+date+" - "+time, 100, 125, {columns:1,align:'center'});

doc.image("C:\\Users\\User\\Pictures\\JKUAT\ Logo.jpg", 250,25,{width:75},{height:75});

doc.end();
