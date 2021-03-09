const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const nodemailer = require('nodemailer');
const { getMaxListeners } = require('process');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const ejs = require('ejs');
/* require('./routes/sendmail') */
const methodOverride = require('method-override');
const Post = require('./models/post');
const ejsEngine = require('ejs-mate');
require('dotenv').config();


const app = express();

//View Engine Setup
/* app.set('views', path.join(__dirname, 'viewa')); */
app.engine('ejs', ejsEngine);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

//Set Static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body paser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'))

/* //set up mongoose
mongoose.connect('mongodb://localhost:27017/ipyramid', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected')
});
 */
const mongoose = require('mongoose');
mongoose
  .connect(/* 'mongodb://localhost:27017/student-mgmt-sys' || */ process.env.DBURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database connected");
    if (process.send) {
      process.send("ready");
    }
  })
  .catch((e) => {
    console.error("An error occured while trying to connect with the database");
    process.exit(0);
  });

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
    res.redirect('/')

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
    res.redirect('/')

})



app.get('/blog', (req, res) => {
    res.render('blog.ejs')
})
app.get('/blogs', async (req, res) => {
    const posts = await Post.find({})
    res.render('blogPosts/newblog', { posts })
})
app.get('/blogs/new', async (req, res) => {
    res.render('blogPosts/new')
})

app.get('/blogs/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('blogPosts/singleblog', { post });
})

app.get('/blogs/:id/edit', async (req, res) => {
    const blog = await Post.findById(req.params.id);
    res.render('blogPosts/edit', { blog })
})

app.post('/blogs', async (req, res) => {
    const blog = await Post(req.body)
    blog.save();
    res.redirect(`/blogs/${blog._id}`)
})

app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const blog = await Post.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/blogs/${blog._id}`)
})
app.delete('/blogs/:id', async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/blogs')
})
app.get('/', (req, res) => {
    res.render("index.ejs");
})
app.get('/coming-soon', (req, res)=>{
    res.render('coming soon/project.ejs')
})
const port = 3500 || process.env.PORT;
app.listen(port, () => {
    console.log('server started');
})
