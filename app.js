const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const { Data, Login } = require('./model/data');

const app = express();
const port = 3000;

// Setup Method Override
app.use(methodOverride('_method'));

// Setup EJS
app.set('view engine', 'ejs');

// Third-party Middleware
app.use(expressLayouts);

// Built-in Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(
    session({
        cookie: { maxAge: 600000 }, // Session valid selama 10 menit
        secret: 'secret',
        resave: true, // Pastikan session selalu disimpan
        saveUninitialized: false, // Tidak menyimpan session yang belum ada data
    })
);

app.use(flash());

// Middleware untuk melindungi semua halaman setelah login
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // Jika sudah login, lanjutkan ke halaman berikutnya
    } else {
        req.flash('msg', 'Silakan login terlebih dahulu');
        res.redirect('/'); // Jika belum login, arahkan ke halaman login
    }
};

// Halaman Login
app.get("/", (req, res) => {
    res.render('login', {
        layout: 'layout/login-layout',
        title: 'Halaman Login',
    });
});

app.post("/login", (req, res) => {
    Login.findOne({ username: req.body.username })
        .then(user => {
            if (user && user.password === req.body.password) {
                // Simpan data pengguna ke session
                req.session.user = user;
                req.flash('msg', 'Login berhasil');
                res.redirect('/home'); // Arahkan ke halaman home setelah login berhasil
            } else {
                req.flash('msg', 'Username atau Password salah');
                res.redirect('/'); // Kembali ke halaman login jika login gagal
            }
        })
        .catch(err => {
            req.flash('msg', 'Terjadi kesalahan, coba lagi');
            res.redirect('/');
        });
});

// Halaman Home
app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', {
        nama: req.session.user.username, // Menampilkan username dari session
        layout: 'layout/main-layout',
        title: 'Halaman Home',
        msg: req.flash('msg'),
    });
});

// Halaman About
app.get('/about', isAuthenticated, (req, res) => {
    res.render('about', {
        layout: 'layout/main-layout',
        title: 'Halaman About',
        msg: req.flash('msg'),
    });
});

// Halaman Data Siswa
app.get('/datasiswa', isAuthenticated, async (req, res) => {
    const siswas = await Data.find();

    res.render('datasiswa', {
        layout: 'layout/main-layout',
        title: 'Halaman Data Siswa',
        siswas,
        msg: req.flash('msg'),
    });
});

// Halaman Form Tambah Data
app.get('/data/add', isAuthenticated, (req, res) => {
    res.render('add-data', {
        title: 'Form Tambah Data',
        layout: 'layout/main-layout',
    });
});

// Proses Tambah Data
app.post('/datasiswa', isAuthenticated, [
    body('nisn').custom(async (value) => {
        const duplikat = await Data.findOne({ nisn: value });
        if (duplikat) {
            throw new Error('NISN tidak boleh sama!');
        }
        return true;
    }),
    body('nik').custom(async (value) => {
        const duplikat = await Data.findOne({ nik: value });
        if (duplikat) {
            throw new Error('NIK tidak boleh sama!');
        }
        return true;
    }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-data', {
            title: 'Form Tambah Data Siswa',
            layout: 'layout/main-layout',
            errors: errors.array(),
        });
    } else {
        Data.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Data berhasil ditambahkan!');
            res.redirect('/datasiswa');
        });
    }
});

// Proses Delete Data
app.delete('/datasiswa', isAuthenticated, (req, res) => {
    Data.deleteOne({ nisn: req.body.nisn }).then((result) => {
        req.flash('msg', 'Data berhasil dihapus!');
        res.redirect('/datasiswa');
    });
});

// Form Ubah Data Siswa
app.get('/datasiswa/edit/:nisn', isAuthenticated, async (req, res) => {
    const data = await Data.findOne({ nisn: req.params.nisn });
    res.render('edit-data', {
        title: 'Form Edit Data',
        layout: 'layout/main-layout',
        data,
    });
});
//max="<%= new Date().toISOString().split('T')[0] %>"
// Proses Ubah Data Siswa
app.put('/datasiswa', isAuthenticated, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('edit-data', {
            title: 'Form Ubah Data',
            layout: 'layout/main-layout',
            errors: errors.array(),
            data: req.body,
        });
    } else {
        const nisn = Array.isArray(req.body.nisn) ? req.body.nisn[0] : req.body.nisn;
        Data.updateOne(
            { nisn: nisn },
            {
                $set: {
                    nama: req.body.nama,
                    jk: req.body.jk,
                    nisn: nisn,
                    nik: req.body.nik,
                    nokk: req.body.nokk,
                    tingkat: req.body.tingkat,
                    rombel: req.body.rombel,
                    terdaftar: req.body.terdaftar,
                    ttl: req.body.ttl,
                    tgl_masuk: req.body.tgl_masuk,
                }
            }
        ).then((result) => {
            req.flash('msg', 'Data berhasil diubah!');
            res.redirect('/datasiswa');
        });
    }
});

// Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/'); // Setelah logout, arahkan ke halaman login
    });
});

app.listen(port, () => {
    console.log(`Project CRUD NodeJS | Listening at http://localhost:${port}`);
});
