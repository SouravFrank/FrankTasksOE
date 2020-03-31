const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeMail = (email, name) => {
    sgMail.send({
        // to: 'sufalchakraborty84@gmail.com',
        to: email,
        from: 'ssadhukhan990@gmail.com',
        subject: 'Welcome! to my app',
        text: `Hey ${name} , Please share your feedback!`
    })
}

const sendCancelMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'ssadhukhan990@gmail.com',
        subject: 'Good Bye',
        text: `Hey ${name} , Your account deleted!`
    })
}

module.exports = {
    sendWelcomeMail,
    sendCancelMail
}