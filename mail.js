//Set Up Mailing
//Should look into doing this outside of this file.

const SparkPost = require('sparkpost');
const sparky = new SparkPost('128f5e326dec000d8e9be352c0aa284417d502be');

//This will be the beautiful html we will use then we add the code. Will look into adding a link for verification. 
let mailBody = '<html><body><h1>Mess Verification</h1><p>Copy the code below and paste it in the chat then click send to get verified and start eating now.</p></body></html>';


let sendOptions =  { 
     content: {
      from: 'Mess@karanjamutahi.com',
      subject: 'Mess Verification',
      //we will modify this email body to be very, very beautiful
      html:mailBody
    },
    recipients: [{
        address: ''}
    ]
  };

  //Change this `data` param later
  function sendmail(recipient,data){
    sendOptions.recipients[0].address=recipient;
            sparky.transmissions.send(data).then(data => {
        console.log('Verification email sent to: ' +sendOptions.recipients[0].address);
         console.log(data);
        }).catch(err => {
        console.log('Whoops! Something went wrong');
        console.error(err);
            });
  }

  exports.sendmail = sendmail();