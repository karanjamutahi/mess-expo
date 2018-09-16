const AToptions = {
    sandbox:true,
    apiKey:process.env.ATSANDBOX,
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

 exports.pay /*mobileCheckout */ = function(amount,number){
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

// mobileCheckout(500, '+254717817569');

exports.checkout = mpesa.checkout();
