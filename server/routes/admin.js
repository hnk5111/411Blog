const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwdSecret = process.env.JWD_SECRET;

const adminLayout = '../views/layouts/admin';

/**
 * 
 * Check Login
 */
const authMiddleware = (req, res, next ) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, jwdSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}


/**
 * GET /
 * HOME
 */
router.get('/admin', async (req, res) => {
    try {
        const locals = {
        title: "Admin",
        description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        res.render('admin/index', { locals, layout: adminLayout });
    } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Admin - Check Login
 */
router.post('/admin', async (req, res) => {
    try {
        const{ username, password} = req.body;
        const user = await User.findOne({ username });

        if (!user) {
          return res.status(401).json({ message: "Invalid Credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign({ userId: user._id}, jwdSecret);
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

    } catch (error) {
    console.log(error);
  }

});

/**
 * POST /
 * Admin - Check Login
 */
router.get('/dashboard', authMiddleware, async (req, res) => {
  res.render('admin/dashboard');
});

// router.post('/admin', async (req, res) => {
//   try {
//     const { username, password } = req.body;
    
//     if(req.body.username === 'admin' && req.body.password === 'password') {
//       res.send('You are logged in.')
//     } else {
//       res.send('Wrong username or password');
//     }

//   } catch (error) {
//     console.log(error);
//   }
// });

/**
 * POST /
 * Admin - Register
 */
router.post('/register', async (req, res) => {
  try {
      const{ username, password} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User Created.', user});
      } catch (error) {
        if(error.code === 11000) {
          res.status(409).json({ message: "User Already in Use."});
        }
        res.status(500).json({ message: 'Internal Server Error.'});
      }
  } catch (error) {
  console.log(error);
}

});


module.exports = router;