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

exports.pay=function(amount,number){
    paymentOptions.amount = amount;
    paymentOptions.phoneNumber =String(number);

    mpesa.checkout(paymentOptions)
            .then(
                function(data){
                    console.log(data);
                })
            .catch(
                function(error){
                    console.log(error);
                });
}

