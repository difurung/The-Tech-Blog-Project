const router = require("express").Router();
const path = require("path");
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Find All Posts
router.get('/', withAuth, async (req, res) => {
    try{
        const postData = await Post.findall({
            attributes: [
                'id',
                'title',
                'postBody',
            ],
            include: [
                {
                    model: Comment,
                    attributes: [ 'id', 'commentBody', 'post_id', 'user_id' ],
                    include: {
                        model: User,
                        attributes: ['user_name']
                    }
                },
                {
                    model: User,
                    attributes: ['userName']
                }
            ],
    });
        const posts = postData.map(post => post.get({plain: true}));
        res.render('posts', {
            posts,
            loggedIn: req.session.loggedIn
        });
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// Create post
router.get('/post/:id', async (req, res) => {
    try { 
        const newPost = await Post.create({
            ...req.body,        
            user_id: req.session.user_id,
        });
        res.status(200).json(newPost);
    } catch (err) {
        res.status(400).json(err);
    }
});


// Delete Posts
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
})
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
})


module.exports = router;