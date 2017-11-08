qr = require('bwip-js');
const fs = require('fs'); 

let barcode = qr.toBuffer({
    bcid:'qrcode',
    text:'811171116543',
    includetext: true,
    textalign: 'center'
}, function(err,png){
    if(err){
        console.log(err);
    }
    else{
        fs.writeFile('barcode.png',png, function(err){
            if (err){
                console.log(err);
            }
            else{
                console.log("success");
            }
        });
    }
});