const router = require('express').Router();
const { User, Post, Comment } = require('../models');
//const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage 
// Homepage Render. All posts.
router.get('/',  async (req, res) => {
  try {  
    const postData = await Post.findAll({
    attributes: [
      'id',
      'title',
      'postBody'
    ],
      include : [
    {
      model: User,
      attributes: ['userName']
    },
    {
      model: Comment,
      attributes: [
        'id',
        'commentBody',
        'post_id',
      ],
      include: {
        model: User,
        attributes: ['userName']
      }
    }
  ],
  }); 

const posts = postData.map((post) => post.get({plain:true}));


  res.render('homepage', {
    posts,
    logged_in: req.session.logged_in
  });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Renders a single post, to Dashboard?? 
router.get('/post/:id', async (req, res) => {

  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "created_at"],
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
        {
          model: Comment,
          attributes: ["id", "commentBody", "post_id"],
          include: {
            model: User,
            attributes: ["userName"],
          },
        },
      ],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render("singlePost", {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json(err);
  }

});





// Login Render
router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  try{
    res.render('login');
}catch (err){
res.status(400).json(err);
}
    
});

// Dashboard render /dashboard

//Post render
   //Comment render


module.exports = router;
