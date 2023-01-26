const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// Prevent non logged in users from viewing the homepage 
// Add withAuth laterin line 6
router.get('/',  async (req, res) => {
  try {  
      res.render('homepage', {
      
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If a session exists, redirect the request to the homepage
  try{
    res.render('login');
}catch (err){
res.status(400).json(err);
}
    
});

module.exports = router;
