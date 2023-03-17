const router = require('express').Router();
const { User, Post, Comment } = require('../models');
const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage 
// Homepage Render. All posts.
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll();
    const users = userData.map((user) => user.get({ plain: true }));

    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err);
  }
});



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

// Renders a single post, to Dashboard
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
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [{ model: Post },
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
      }}
      ],
      
    });

    const user = userData.get({ plain: true });

    res.render("dashboard", {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


//Post render
   //Comment render


module.exports = router;
