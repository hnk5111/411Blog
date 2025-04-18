const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');

/**
 * GET /
 * Add Comment
*/
router.get('/post/:postId', async (req, res) => {
  try {
    const { postId } = req.params; 

    const data = await Post.findById(postId);

    const comments = await Comment.find({ postId }).exec();

    res.render('post', {
      title: data.title,
      postId,
      data,
      comments,
      currentRoute : `/post/${postId}`
    });

  } catch (error) {
    console.log(error);
  }

});
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
 * Add Comment
*/
router.get('/add-comment/:postId', async (req, res) => {
  try {
    const { postId } = req.params; 

    const post = await Post.findById(postId);

    res.render('add-comment', {
      title: 'Add Comment',
      postId,
      post
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Add Comment
*/
router.post('/add-comment', async (req, res) => {
  try {
    const { title, body, postId } = req.body;
    const newComment = new Comment({
      title,
      body,
      postId,
    });

    await newComment.save();

    res.redirect(`/post/${postId}` );

  } catch (error) {
    console.log(error);
  }

});

module.exports = router;