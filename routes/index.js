var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const upload=require('./multer');
// Passport Configuration
passport.use(new LocalStrategy(userModel.authenticate()));
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

/* Home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/login", function (req, res, next) { 
  res.render("login",{error:req.flash("error")});
});

router.post("/upload",isLoggedIn, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).send('No files were uploaded.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file: ", err.message);
  }
  const user=await userModel.findOne({username:req.session.passport.user})
  const postdata=await postModel.create({
    image:req.file.filename,
    imageText:req.body.filecaption,
    user:user._id
  })
   user.posts.push(postdata._id);
   await user.save();
  res.redirect("/profile");
});

/* Profile page. */
router.get("/profile", isLoggedIn, async function (req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
  }) 
  .populate("posts")
  console.log(user);
  res.render("profile",{user}); // Assuming you have a profile.ejs view
});

/* Register route. */
router.post("/register", function (req, res) {
  const { username, email, fullname } = req.body;
  const userdata = new userModel({ username, email, fullname });

  
router.get("/feed", function (req, res, next) {
  res.render("feed");
});

  userModel
    .register(userdata, req.body.password)
    .then(function () {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/login");
      });
    })
    .catch(function (err) {
      res.redirect("/register"); // Handle errors, e.g., user already exists
    });
});

/* Login route. */
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash:true
  }),
  function (req, res) {}
);

/* Logout route. */
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;

// var express = require("express");
// var router = express.Router();
// const userModel = require("./users");
// const postModel = require("./post");
// const passport = require("passport");
// const localstratergy = require("passport-local");
// passport.authenticate(new localstratergy(userModel.authenticate()));
// /* ./users home page. */
// router.get("/", function (req, res, next) {
//   res.render("index", { title: "Express" });
// });

// router.get("/profile", isLoggedIn, function (req, res, next) {
//   res.redirect("profile");
// });

// router.get("/register", function (req, res) {
//   const { username, email, fullname } = req.body;
//   const userdata = new userModel({ username, email, fullname });

//   userModel.register(userdata, req.body.password).then(function () {
//     passport.authenticate("local")(req, res, function () {
//       res.redirect("/profile");
//     });
//   });
// });

// router.get(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/profile",
//     failureRedirect: "/",
//   }),
//   function (req, res) { }
// );

// router.get("/logout", function (req, res) {
//   req.logout(function (err) {
//     if (err) {
//       return next(err);
//     }
//     res.redirect("/");
//   });
// });

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) return next();
//   res.redirect("/");
// }

// // router.get('/alluserpost', async function(req, res, next) {
// //   let user=await userModel.findOne({_id:"66925d4788706a95a36d3a45"})
// //   .populate('posts')
// //   res.send(user)
// // });

// // router.get('/createduser',async  function(req, res, next) {
// //   let createduser =await userModel.create({
// //     username: "shyam550",
// //     password: "123456",
// //     posts: [],
// //     email: "vayashyam@gmail.com",
// //     fullName: "shyam soni"
// // })
// // res.send(createduser)
// // });

// // router.get('/createpost', async function(req, res, next) {
// //     let createdpost=await postModel.create({
// //       postText: "hello this is my first post",
// //       user:"66925d4788706a95a36d3a45"
// //     })
// //     let user=await userModel.findOne({_id:"66925d4788706a95a36d3a45"});
// //     user.posts.push(createdpost._id);
// //     await user.save();
// //     res.send("createdpost")
// // });

// module.exports = router;
