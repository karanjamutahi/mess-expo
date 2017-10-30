//Mess Bot

/*           
                    ~~~~~~~~~~~~~~
                         UX specs        
                   ~~~~~~~~~~~~~~

First time user :
send start: Get email verified. We need a way to make sure we block you if you've not verified your email

After verification(Normal Users) :
--> Your actions should be time restricted. We can do this by nesting callbacks. e.g onText('starch') only fires within lunch & supper event. 

--> Also, we should send an event for pre-orders. People should send pre-orders then at certain times, have certain states [ Breakfast, Lunch, Supper ]. 

--> We set Breakfast menus, Lunch menu and Supper menu (should be the same for Lunch and Supper)

--> I also want to try and update the price on each item as you progress (in the keyboard together with the pay/checkout option) 

 */

//Our UUID function
//This should be in a module of its own

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
const token = '244813675:AAF96cCsa10ouIqZYf4LBr00s1JBvVnvo3c' ; //Zenpi bot [Dev purposes only]
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

//Set Time Options after launching bot
let time = '' ;

if(new Date().getUTCHours()>=18&&new Date().getUTCHours()<5){
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
    menu.stews = undefined;
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
         newArr.push([array[i]]);
     };   
    return newArr; 
}

if (time !== time){
    mybot.sendMessage(142938608, 'It\'s '+time+' time');
}

//PRODUCTION SETTINGS
//mybot.setWebHook(`${url}/bot${token}`);

var webhookurl = `${url}/bot${token}`;

let helpMsg = "Available commands:\n/order : Place an order\n/menu : See what's on today's menu\n";

//start command

mybot.onText(/\/start/, (msg) => {
 contextIndex=0;   
 let WelcomeText = "Welcome "+msg.chat.first_name.toString()+"\nI need to verify you first before we begin. Please send me your JKUAT email.";
    mybot.sendMessage(msg.chat.id, WelcomeText);

        mybot.onText(/.jkuat.ac.ke/, function (msg) {
            mybot.sendMessage(msg.chat.id, "Check your inbox for an email saying Mess Verification and send me the code in there. Please check in your Spam folder if you do not see the email.");
            sendOptions.recipients[0].address=msg.text.toString();
            sparky.transmissions.send(sendOptions).then(data => {
        console.log('Verification email sent to: ' +sendOptions.recipients[0].address);
        console.log(data);
        }).catch(err => {
        console.log('Whoops! Something went wrong');
        console.error(err);
            });
            
        });

});

let orderObj = {};
// orderObj[msg.chat.id].cost = 0; //To be placed appropriately

let availOptions = ["starch","stews","sides","beverages"];

//Ordering UX
//Keyboard 1 - Orders
mybot.onText(/\/order/, (msg)=>{
    contextIndex=1;
        mybot.sendMessage(msg.chat.id, "Choose a place to start", {
            "reply_markup":{
                "keyboard":menuIterator(availOptions)
            }
        });
    });

mybot.onText(/starch/, (msg)=>{
    contextIndex=2;
    mybot.sendMessage(msg.chat.id, "Have your pick. Click next to skip immediately", {
        "reply_markup":{
            "keyboard":menuIterator(menu.starch)
        }
    });

});

var vals = Object.keys(menu).map(function(key) {
    return menu[key];
});

    mybot.onText(/next/, (msg)=>{
        console.log(contextIndex);
        console.log(vals);

        switch(contextIndex){
            case 1:
            ++contextIndex;
            break;

            case 2:
            mybot.sendMessage(msg.chat.id, "How about a stew with that?",{
                "reply_markup":{
                    "keyboard":menuIterator(menu.stews)
                }
                });
                ++contextIndex;

            break;

            case 3:
            mybot.sendMessage(msg.chat.id, "Top it up? Once you're done, just hit pay",{
                "reply_markup":{
                    "keyboard":menuIterator(menu.sides)
                }
                });
                ++contextIndex;

            break;

            
        }

        
            });
    


//stop command
mybot.onText(/\/stop/, (msg)=>{
    mybot.sendMessage(msg.chat.id, "Goodbye. Please shoot an email to mess@jkuat.ac.ke for any complaints. You can continue using your account at any time.");
});

//help command
mybot.onText(/\/help/, (msg)=>{
    mybot.sendMessage(msg.chat.id, helpMsg);
});

mybot.on('message',(msg)=>{

})