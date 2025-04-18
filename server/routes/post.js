const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
/**
 * GET /
 * Comment :id
*/
router.get('/comment/:id', async (req, res) => {
    try {
        let slug = req.params.id;
    
        const data = await Comment.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express, & MongoDB.",
        }

        res.render('partials/comment', { locals, data, currentRoute: `comment/${slug}`, });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Create New Comment
*/
router.get('/add-comment', async (req, res) => {
  try {
    const locals = {
      title: 'Add Comment',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Comment.find();
    res.render('add-comment', {
      locals,
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Create New Comment
*/
router.post('/add-comment', async (req, res) => {
  try {
    try{
      const newComment = new Comment({
        title: req.body.title,
        body: req.body.body
      });

      await Comment.create(newComment);
      res.redirect(`/post/${newComment._id}` );
    }catch(error){
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }

});

module.exports = router;