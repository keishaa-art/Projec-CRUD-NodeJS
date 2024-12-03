const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/dapodik', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
})

// // Menambah 1 Data
// const data1 = new Data({
//      nama: 'Naufal Athaillah',
//      jk: 'L',
//      nisn: '1232929w',
//      nik: '829203987',
//      nokk: '736647489387890',
//      tingkat: 'XI',
//      rombel: 'RPL 1',
//      terdaftar: 'Murid',
//      ttl: 'Majalengka',
//      tgl_masuk: '2022-08-13',
// })

// //Simpan ke collection
// data1.save().then((data) => console.log(data))
