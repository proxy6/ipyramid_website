const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const app = express();

app.post('/contact', async (req, res) => {
    const output = `
<p>You have a new contact information</p>
<h3>Contact Details</h3>
<ul>
<li>Name: ${req.body.name}</li>
<li>Email: ${req.body.email}</li>
<li>Date: ${new Date()}</li>
<li>Service: ${req.body.service}</li>
</ul>
<h3>Message:</h3>
<p>${req.body.message}</p>
`

    const input = `
<h3> IpyramidTech <h3>
<p> Dear ${req.body.name} </p>
<p> Your details have been received and we will get back to you soon </p>
`
    const userEmail = req.body.email;
    async function main() {
        let transporter = nodemailer.createTransport({
            host: "mail.rydox.net",
            port: 465,
            secure: true,
            auth: {
                user: 'progress@rydox.net',
                pass: 'PROgress657'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Ipyramid Tech" <progress@rydox.net>', // sender address
            to: "contact.ipyramidtech@gmail.com", // list of receivers
            subject: "Contact Info", // Subject line
            // plain text body
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    }

    main().catch(console.error);
    res.redirect('/', { msg: 'email has been sent' })

    const transport = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    );
    transport.sendMail({
        from: 'ipyramidtech@gmail.com',
        to: 'progresseze@gmail.com',
        subject: 'IpyramidTech: We got your mail!',
        html: `
        <h3> IpyramidTech <h3>
        <p> Dear ${req.body.name} </p>
        <p> Your details have been received and we will get back to you soon </p>
        `
    })
        .then(([res]) => {
            console.log('Message delivered with code %s %s', res.statusCode, res.statusMessage);
        })
        .catch(err => {
            console.log('Errors occurred, failed to deliver message');

            if (err.response && err.response.body && err.response.body.errors) {
                err.response.body.errors.forEach(error => console.log('%s: %s', error.field, error.message));
            } else {
                console.log(err);
            }
        });


})

app.post('/consult', (req, res) => {
    const output = `
<p>You have a new free consultation</p>
<h3>Free Consultation details</h3>
<ul>
<li>Name: ${req.body.name}</li>
<li>Email: ${req.body.email}</li>
<li>Date: ${new Date()}</li>
</ul>
<h3>Message:</h3>
<p>${req.body.message}</p>
`


    async function main() {
        let transporter = nodemailer.createTransport({
            host: "mail.rydox.net",
            port: 465,
            secure: true,
            auth: {
                user: 'progress@rydox.net',
                pass: 'PROgress657'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Ipyramid Tech" <progress@rydox.net>', // sender address
            to: "contact.ipyramidtech@gmail.com", // list of receivers
            subject: "Contact Info", // Subject line
            // plain text body
            html: output // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...


    }

    main().catch(console.error);
    res.render('index.ejs')

})
