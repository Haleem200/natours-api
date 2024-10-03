const nodemailer = require('nodemailer')

const sendEmail = async options => {

    //Create a Nodemailer transporter using either SMTP or some other transport mechanism

    const transporter = nodemailer.createTransport(({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    }))

    //Set up message options (who sends what to whom)
    const messageOptions = {
        from: "natours@server.com",
        to: options.email,
        subject: options.subject,
        text: options.message
      };

    //Deliver the message object using the sendMail() method of your previously created transporter
    await transporter.sendMail(messageOptions)
}

module.exports = sendEmail;


