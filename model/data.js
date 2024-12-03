const mongoose = require('mongoose')
const moment = require('moment')

// Membuat Schema Login
const Login = mongoose.model('User', {
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

// Membuat Schema Data
const Data = mongoose.model('Siswa', {
    nama: {
        type: String,
        required: true,
    },
    jk: {
        type: String,
        required: true,
    },
    nisn: {
        type: String,
        required: true,
    },
    nik: {
        type: String,
        required: true,
    },
    nokk: {
        type: String,
        required: true,
    },
    tingkat: {
        type: String,
        required: true,
    },
    rombel: {
        type: String,
        required: true,
    },
    terdaftar: {
        type: String,
        required: true,
    },
    ttl: {
        type: String,
        required: true,
    },
    tgl_masuk: {
        type: Date,
        required: true,
        set: function (value){
            return moment(value, 'YYYY-MM-DD').toDate()
        },
        get: function (value){
            return moment(value).format('YYYY-MM-DD')
        }
    },
})

module.exports = { Data, Login }