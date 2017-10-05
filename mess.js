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

mybot = new Bot(token, {polling:true});
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

switch(time){
    case 'breakfast':
    menu.starch = ['mandazi','Rockbun','Bread Slice','Soft Buns'];
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

function menuIterator(array){
    var newArr = [ ];
     for(var i=0;i<array.length;i++){
         newArr.push([array[i]]);
     };   
    return newArr; 
}

if (time !== time){
    mybot.sendMessage(142938608, 'It\'s '+time+' time');
}

//production settings
//mybot.setWebHook(`${url}/bot${token}`);

var webhookurl = `${url}/bot${token}`;
console.log("THIS IS THE BLOODY URL---> "+webhookurl );

let helpMsg = "Available commands:\n/order : Place an order\n/menu : See what's on today's menu\n";

//Make sure we see all incoming messages on CLI FOR DEBUGGING PURPOSES
//Remove this in production
mybot.on('message', function(msg){
    //console.log(msg);
    console.log(msg.chat.username+" >> "+msg.text.toString());
});

//start command

mybot.onText(/\/start/, (msg) => {
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

//Keyboard 1 - Starches
    mybot.onText(/\/starch/, (msg)=>{
        mybot.sendMessage(msg.chat.id, "Choose a Starch from our list below", {
            "reply_markup":{
                "keyboard":menuIterator(menu.starch)
            }
        });
    });

mybot.onText(/next/, (msg)=>{
    mybot.sendMessage(msg.chat.id, "How about a stew with that? Click next to skip or advance",{
            "reply_markup":{
                "keyboard":[["Beef"],["Beans"],["Ndengu"],["African Stew"],["Egg Curry"],["Omlette"],["Next"]]
            }
            });
});

mybot.onText(/Next/, (msg)=>{
    mybot.sendMessage(msg.chat.id, "Veggies are good for your health",{
            "reply_markup":{
                "keyboard":[["Yes, please"],["No, thanks"]]
            }
    });
});

//stop command
mybot.onText(/\/stop/, (msg)=>{
    mybot.sendMessage(msg.chat.id, "Goodbye. Please shoot an email to mess@jkuat.ac.ke for any complaints. You can continue using your account at any time.");
});

//help command
mybot.onText(/\/help/, (msg)=>{
    mybot.sendMessage(msg.chat.id, helpMsg);
});