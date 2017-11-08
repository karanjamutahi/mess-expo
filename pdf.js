const pdfDoc = require('pdfkit');
const fs = require ('fs');

let doc = new pdfDoc;
let time = new Date().getHours() + ":" + new Date().getMinutes(); 
let date = new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear();
let heightTracker = 200;

let orderObj = { '142938608':
{ item: [ 'mandazi', 'mandazi', 'Smokies', 'Boiled Egg' ],
  bill: 45 } };


let receipt = doc.pipe(fs.createWriteStream('output.pdf'));

doc.font("C:\\Windows\\Fonts\\Candara.ttf")
.fontSize(25)
.text('JKUAT MESS-LUNCH-'+date+"-"+time, 100, 125);

doc.image("C:\\Users\\User\\Pictures\\JKUAT\ Logo.jpg", 250,25,{width:75},{height:75});



let fontObj = doc.font(".\\fonts\\Candara.ttf");
let textObj = fontObj.fontSize(17);

function iterator(obj){
    doc.moveDown();
    doc.moveDown();
    for(var i=0;i<obj.item.length;i++){
        textObj.text(obj.item[i],20);
        textObj.text(obj.item[i].length, 500);
        doc.moveDown();
    }
    fontObj.fontSize(25).text("Grand Total", 20);
    textObj.text(obj.bill, 500);
}
iterator(orderObj['142938608']);

doc.image("C:\\Users\\User\\Code\\Mess\\mess-expo\\barcode.png",250,600,{width:110},{height:110});

doc.end();
