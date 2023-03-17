const router = require("express").Router();
const path = require("path");
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

//Get all comments



router.get('/', withAuth, async (req,res) => {
    try{
      const commentBody = await Comment.findAll({
        attributes: [
          'id',
          'post_id',
          'user_id',
          'commentBody',
          'userName'

        ],
        include: [{model: Post,
        include:{model: User, attributes: ['userName']}}]
      })
      res.json(commentBody)
    }catch(err){
      console.log(err);
      res.status(500).json(err)
    }
});

// Create Comments
router.post("/", withAuth, (req, res) => {
  Comment.create({
    comment_text: req.body.commentBody,
    user_id: req.session.user_id,
    post_id: req.body.post_id,
  })
    .then((dbCommentData) => res.json(dbCommentData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});




// Delete comments?
