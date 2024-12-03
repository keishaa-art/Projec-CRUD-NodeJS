// const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
// const { body, validationResult, check } = require('express-validator');
// const methodOverride = require('method-override');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const flash = require('connect-flash');
// require('./utils/db');
// const Login = require('./model/data'); // Gunakan model Data

// const app = express();
// const port = 3000;

// // Setup Method
// app.use(methodOverride('_method'));

// // Setup EJS
// app.set('view engine', 'ejs');

// // Built-in middleware
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: false }));

// // Konfigurasi flash
// app.use(cookieParser('secret'));
// app.use(
//   session({
//     cookie: { maxAge: 6000 },
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true,
//   })
// );

// app.use(flash());

// app.get("/", (req, res) => {
//   res.render('login', {
//         layout: 'layout/main-layout',
//         title: 'Halaman Login', 
//   });
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body
//     const User = await User.findOne({ username: req.body.username });

//     // Cek apakah user ditemukan dan password cocok
//     if (User && User.password === req.body.password) {
//       res.render("/home"); // Arahkan ke halaman aplikasi jika berhasil login
//     } else {
//       req.flash('msg', 'Password anda salah!');
//       res.redirect("/"); // Redirect ke halaman login jika password salah
//     }
//   } catch (error) {
//     req.flash('msg', 'Terjadi kesalahan saat login!');
//     res.redirect("/"); // Redirect ke halaman login jika terjadi error
//   }
// });

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });
