function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

let code = create_UUID();

//Set up the Telegram bot
const token = process.env.TELEGRAMKEY
const Bot = require('node-telegram-bot-api');

//Setting up Heroku webhook
const webhookOpts = {
    webHook: {
        port: process.env.PORT || 443
    }
}; 

const url = process.env.APP_URL || 'https://jkuatmess.herokuapp.com:443';

mybot = new Bot(token, {polling:true}); //CHANGE THIS IN PRODUCTION
console.log('bot server started');

//PRODUCTION SETTINGS
//mybot.setWebHook(`${url}/bot${token}`);


//Set Time Options after launching bot
let time = 'breakfast' ;

if(new Date().getUTCHours()>=17&&new Date().getUTCHours()<5){
    time = 'breakfast';
}

else if(new Date().getUTCHours()>=5&&new Date().getUTCHours()<11){
    time = 'lunch';
}

else if(new Date().getUTCHours()>=11&&new Date().getUTCHours()<17){
    time = 'supper';
}

else{

}

console.log(time);

let menu = {
    'starch':'',
    'beverages':'',
    'stews':'',
    'sides':''
};

let cost = {
    "mandazi":10,
    "Rock bun":15,
    "Bread Slice":2,
    "Soft Buns": 15,
    "Tea": 10,
    "Coffee":10,
    "Smokies":15,
    "Boiled Egg": 10,
    "Fried Egg": 12,
    "Rice":12,
    "Ugali":5,
    "Chapati":10,
    "Beans": 13,
    "Ndengu":13,
    "African Stew": 20,
    "Egg Curry": 12,
    "Veggies": 5,
}

switch(time){
    case 'breakfast':
    menu.starch = ['mandazi','Rock bun','Bread Slice','Soft Buns'];
    menu.beverages = ['Tea', 'Coffee'];
    menu.stews = ['Really?!'];
    menu.sides = ['Smokies', 'Boiled Egg', 'Fried Egg'];
    break;

    case 'lunch':
    menu.starch = ['Rice','Ugali','Chapati'];
    menu.beverages = ['Tea', 'Coffee'];
    menu.stews = ['Beans', 'Ndengu', 'African Stew', 'Egg Curry'];
    menu.sides = ['Fried Egg' ,'Veggies'];
    break;    

    case 'supper':
    menu.starch = ['Rice','Ugali','Chapati'];
    menu.beverages = ['Tea', 'Coffee'];
    menu.stews = ['Beans', 'Ndengu', 'African Stew', 'Egg Curry'];
    menu.sides = ['Fried Egg' ,'Veggies'];
    break; 
}

let contextIndex = 0;

/*
0:Pre-order
1:Order
2:Starch
3:Stews
4:Sides
5:Pay
*/

let currentCost = 0;
function menuIterator(array){
    let payBtn = "Pay("+currentCost+")";
    var newArr = [[payBtn, 'next']];      //FIX THIS IF IT DOESN"T WORK
     for(var i=0;i<array.length;i++){
         newArr.push(["."+array[i]]);
     };   
    return newArr; 
}

if (time !== time){
    mybot.sendMessage(142938608, 'It\'s '+time+' time');
}



var webhookurl = `${url}/bot${token}`;

let helpMsg = "Available commands:\n/order : Place an order\n/menu : See what's on today's menu\n";

//start command

mybot.onText(/\/start/, (msg) => {
 contextIndex=0;   
 let WelcomeText = "Welcome "+msg.chat.first_name.toString()+"\nThanks for choosing our service. Type /help to know how to use the bot.\n/menu will show you what's on today's menu.\nOnce you're ready type /order to begin";
    mybot.sendMessage(msg.chat.id, WelcomeText);
});

let orderObj = {};
let currentMenu = [];
// orderObj[msg.chat.id].cost = 0; //To be placed appropriately

let availOptions = ["starch","stews","sides","beverages"];

//Ordering UX
//Keyboard 1 - Orders
mybot.onText(/\/order/, (msg)=>{
    orderObj[msg.chat.id] = {};
    orderObj[msg.chat.id]['item'] = [];
    orderObj[msg.chat.id]['bill'] = 0;
    currentCost = 0;
    contextIndex=1;

        mybot.sendMessage(msg.chat.id, "Choose a place to start. Click on an item as many times to select quantity", {
            "reply_markup":{
                "keyboard":menuIterator(availOptions)
            }
        });
    });

mybot.onText(/starch/, (msg)=>{
    contextIndex=2;
    currentMenu = menu.starch;
    mybot.sendMessage(msg.chat.id, "Have your pick. Click next to skip immediately", {
        "reply_markup":{
            "keyboard":menuIterator(menu.starch)
        }
    });

});

mybot.onText(/stews/, (msg)=>{
    contextIndex=3;
    mybot.sendMessage(msg.chat.id, "Have your pick. Click next to skip immediately", {
        "reply_markup":{
            "keyboard":menuIterator(menu.stews)
        }
    });

});

mybot.onText(/sides/, (msg)=>{
    contextIndex=4;
    mybot.sendMessage(msg.chat.id, "Have your pick. Click next to skip immediately", {
        "reply_markup":{
            "keyboard":menuIterator(menu.sides)
        }
    });

});

var vals = Object.keys(menu).map(function(key) {
    return menu[key];
});
console.log(vals);

    mybot.onText(/next/, (msg)=>{
       // console.log(contextIndex);
       // console.log(vals);

        switch(contextIndex){
            case 1:
            currentMenu = menu.starch;
            ++contextIndex;
            break;

            case 2:
            currentMenu = menu.stews;
            mybot.sendMessage(msg.chat.id, "How about a stew with that?",{
                "reply_markup":{
                    "keyboard":menuIterator(menu.stews)
                }
                });
                ++contextIndex;

            break;

            case 3:
            currentMenu = menu.sides;
            mybot.sendMessage(msg.chat.id, "Top it up? Once you're done, just hit pay",{
                "reply_markup":{
                    "keyboard":menuIterator(menu.sides)
                }
                });
                ++contextIndex;

            break;

            
        }

        
            });

            
    
function updateCost(recipient){
    let costChecker = 0;
    if(costChecker!==currentCost){
        mybot.sendMessage(recipient, "Current Bill: "+currentCost, {
            "reply_markup":{
                "keyboard":menuIterator(currentMenu)
            }
    });
}
}


//stop command
mybot.onText(/\/stop/, (msg)=>{
    mybot.sendMessage(msg.chat.id, "Goodbye. Please shoot an email to mess@jkuat.ac.ke for any complaints. You can continue using your account at any time.");
});


//help command
mybot.onText(/\/help/, (msg)=>{
    mybot.sendMessage(msg.chat.id, helpMsg);
});

mybot.onText(/\./,(msg)=>{
let message = msg.text.slice(1);
console.log(message+" \n");

for(var ind = 0;ind<vals.length;ind++){
    if(vals[ind].indexOf(message)!==-1){
        orderObj[msg.chat.id]['item'].push(message);
        orderObj[msg.chat.id]['bill'] += cost[message];
        currentCost = orderObj[msg.chat.id]['bill'];
        console.log(orderObj);

        updateCost(msg.chat.id);
    }

}
});

/*At this stage we get set to Handle Payments
We also set up express to handle the callback
*/

let express = require ('express');
let app = express ();

app.post('/payments', function(req,res){
    console.log('paid');
    mybot.sendMessage('142938608',"Paid");
});
app.listen(3000);

const AToptions = {
    sandbox:true,
    apiKey:'ff90fcdb6e9344b90c52bcb7870fbab7459dbd954c1ea69ea92ea78713e59563',
    username:'sandbox',
    format:'json'
};

const AT = require('africastalking')(AToptions);
const mpesa = AT.PAYMENTS;

let paymentOptions = {
    'productName':'Mess Bot',
    'phoneNumber':'',
    'currencyCode':'KES',
    'amount': '', 
    'metadata':{

    }
};

 mobileCheckout  = function(amount,number){
    paymentOptions.amount = amount;
    paymentOptions.phoneNumber =String(number);

    mpesa.checkout(paymentOptions)
            .then(
                function(data){
                    if (data.status === 'pendingConfirmation'){
                        setTimeout(function(){

                        },15000);
                    }
                })
            .catch(
                function(error){
                    console.log(error);
                });
}

const qr = require('bwip-js');
const fs =  require('fs');
const pdfDoc = require('pdfkit');

function uniqueGen(){
    let arr = [];
    for(var i = 0;i<4;i++){
        arr.push(Math.floor(Math.random()*10));
    }
    return arr.join('');
}


mybot.onText(/Pay/, (msg)=>{
    if (currentCost){
        mybot.sendMessage(msg.chat.id, "Enter your Phone Number in the format +254722xxxxxx");
        mybot.onText(/\+2547/,(msg)=>{
            paymentOptions.amount = Number(currentCost);
            paymentOptions.phoneNumber = msg.text;

            mpesa.checkout(paymentOptions)
            .then(
                function(data){
                    if (data.status === 'pendingConfirmation'){
                        //weka delay ya Uongo
                        setTimeout(function(){

                            //generate QR Code
                            let date = String(new Date().getDate()) + String(new Date().getMonth()) + String(new Date().getFullYear());
                            let dateTimePretty = String(new Date().getDate()) +"/"+ String(new Date().getMonth()) +"/"+ String(new Date().getFullYear()) +"-"+ String(new Date.getHours()) +":"+ String(new Date().getMinutes());
                            let timeString = String(new Date.getHours()) + String(new Date().getMinutes());
                            let fourPin = uniqueGen();
                            let uniqueID = date+timeString+uniqueID;

                            qr.toBuffer({
                                bcid: 'qrcode',
                                text: uniqueID,
                                includetext:true,
                                textxalign:'center'
                            }, function(err,png){
                                if(err){
                                    console.log('Bwip Error\n' + err);
                                }
                                else{
                                    console.log("Generatin Receipt");
                                    fs.writeFile('barcode.png', png, function(err){
                                        if(err){
                                            console.log("Barcode WriteFile error\n" + err);
                                        }
                                        else{
                                          //generate PDF
                                          console.log("Genereating PDF Receipt");
                                          let doc = new pdfDoc;
                                          let receipt = doc.pipe(fs.createWriteStream('receipt.pdf'));  
                                            doc.font("./fonts/Candara.ttf")
                                               .fontSize(25)
                                               .text("JKUAT MESS-"+time+"-"+dateTimePretty);
                                            doc.image(".\\images\\JKUAT.jpg",250,25,{width:75},{height:75});
                                            let fontObj = doc.font(".\\fonts\\Candara.ttf");
                                            let textObj = fontObj.fontSize(17);
                                            
                                            function receiptIterator(obj){
                                                doc.moveDown();
                                                doc.moveDown();
                                                for(var i=0;i<obj.item.length;i++){
                                                    textObj.text(obj.item[i],20);
                                                    textObj.text(cost[obj.item[i]],500);
                                                    doc.moveDown();
                                                }
                                                fontObj.fontSize(25).text("Grand Total", 20);
                                                textObj.text(obj.bill,500);
                                            }
                                            receiptIterator(orderObj[msg.chat.id]);
                                            doc.image(".\\barcode.png",250,600,{width:110},{height:110});
                                            doc.end();
                                            //receipt generated!
                                            //Send receipt to user synchrounously.
                                            //Push OrderObj to db 
                                        }
                                    });
                                }
                            });

                        },20000);
                    }
                })
            .catch(
                function(error){
                    console.log(error);
                });

            //console.log(payment);
        });
    }
});
