const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

/*
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
    try {
        const locals = {
            title: "NodeJS Blog",
            description: "Simple blog created using NodeJS, Express & MongoDB."
        }

        let perPage = 6; //how many blogs posts to display per page
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { createdAt: -1} } ])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });

    } catch (error){
        console.log(error);
    }

});
/*router.get('/home', (req, res) => {
    res.render('index', {
        currentRoute: '/'
    });
});*/
router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    });
});
router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    });
})

/**
 * GET /
 * Post :id
 */
router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id;
    
        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express, & MongoDB.",
        }

        res.render('post', { locals, data, currentRoute: `/post/${slug}`, });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Post - searchTerm
 */

router.post('/search', async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express, & MongoDB."
        }

        let searchTerm = req.body.searchTerm;

        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
        const data = await Post.find({
            $or: [
                { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
                { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
            ]
        });

        res.render("search", {
            data,
            locals
        });
    } catch (error) {
        console.log(error);
    }
});
/*
/**
 * GET /
 * Comment :id

router.get('post/comment/:id', async (req, res) => {
    try {
        let slug = req.params.id;
    
        const data = await Comment.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: "Simple Blog created with NodeJs, Express, & MongoDB.",
        }

        res.render('comment', { locals, data, currentRoute: `/post/comment/${slug}`, });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Create New Comment

router.get('/add-comment', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Add Comment',
      description: 'Simple Blog created with NodeJs, Express & MongoDb.'
    }

    const data = await Comment.find();
    res.render('post/add-comment', {
      locals,
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Create New Comment

router.post('/add-comment', authMiddleware, async (req, res) => {
  try {
    try{
      const newComment = new Comment({
        title: req.body.title,
        body: req.body.body
      });

      await Comment.create(newComment);
      res.redirect('/post/');
    }catch(error){
      console.log(error);
    }

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * Create New Comment

router.get('/edit-comment/:id', authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: 'Edit Comment',
      description: 'Free NodeJs User Management System.',
    }

    const data = await Comment.findOne({ _id: req.params.id });
    res.render('post/edit-comment', {
      locals,
      data,
    })

  } catch (error) {
    console.log(error);
  }

});

/**
 * PUT /
 * Create New Comment
router.put('/edit-comment/:id', authMiddleware, async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect(`/edit-comment/${req.params.id}`)

  } catch (error) {
    console.log(error);
  }

});
*/


module.exports = router;