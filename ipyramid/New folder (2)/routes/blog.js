const express = require('express');
const blogRouter = express.Router();
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage: storage });

const Post = require('../models/post')
const {isLoggedin, isAdmin} = require('../middlewares/authenticate')

// GET ALL POST
blogRouter.get('/', async (req, res) => {
    const posts = await Post.find({});
    res.render('blogs/index', { posts })
})

//GET ADD NEW POST PAGE
blogRouter.get('/new', isLoggedin, isAdmin, (req, res) => {
    res.render('blogs/new');
})

// POST NEW BLOG ARTICLE
blogRouter.post('/', isLoggedin, isAdmin, upload.single('image'), async (req, res) => {
    const {title, author, content, tags, date} = req.body
    const {image} = req.file.path
    if (!req.file) 
    return res.send('Please upload a file')
    const post = new Post({title, author, content, tags, date, image});
    res.send(post)
/*     await post.save();
    res.send(post) */

    /* res.redirect(`/blogs/${post._id}`); */
})

// GET SHOW PAGE FOR A BLOG POST
blogRouter.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('blogs/show', { post });
})

// GET EDIT PAGE FOR A BLOG POST
blogRouter.get('/:id/edit', isLoggedin, isAdmin, async (req, res) => {
    const blog = await Post.findById(req.params.id);
    res.render('blogs/edit', { blog })
})

//POST EDIT PAGE
blogRouter.put('/:id', isLoggedin, isAdmin, async (req, res) => {
    const { id } = req.params;
    const blog = await Post.findByIdAndUpdate(id, { ...req.body })
    res.redirect(`/blogs/${blog._id}`)
})

// DELETE BLOG ARTICLE
blogRouter.delete('/:id', isLoggedin, isAdmin, async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/blogs')
})


module.exports = blogRouter