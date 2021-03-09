const mongoose = require('mongoose');
const Post = require('../models/post');
const fetch = require('node-fetch');
const faker = require('faker');
mongoose.connect('mongodb://localhost:27017/ipyramid', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('db connected')
});

const seedDB = async () => {
    await Post.deleteMany({});
    //generate 20 random dummu data from faker
    for (let i = 0; i <= 20; i++) {
        let title = faker.lorem.sentence();
        let image = faker.image.imageUrl();
        let author = faker.internet.userName();
        let content = faker.lorem.paragraphs();
        let tag = faker.lorem.word();
        let post = new Post({
            title: title,
            image: image,
            author: author,
            content: content,
            tags: [tag, tag, tag]

        })
        await post.save();
    }
}
seedDB();

