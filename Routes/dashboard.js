const express = require('express');
const { checkToken, authPage } = require('../controllers/auth');
const connection = require('../models/db')
const router = express.Router();

router.get('/', (req, res) => {
    res.redirect('/login')
});

router.get('/login', authPage, (req, res) => {
    res.render('login', {
        title: 'login',
        messages: ''
    })
});

router.get('/register', authPage, (req, res) => {
    res.render('register', {
        title: 'Register',
        messages: ''
    });
});

router.get('/logout', async(req, res) => {
    try {
        res.clearCookie('loginwithjwt')
        res.redirect('/login')
    } catch (error) {
        res.redirect('/login')
        res.send(error)
    }
})

router.get('/user', checkToken, (req, res) => {
    const id = req.user.id;
    const sql = `SELECT * FROM user WHERE id=${id}`;
    const log = `SELECT * FROM log WHERE id=${id} ORDER BY date DESC`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err)
        } else {
            connection.query(log, (err, rows) => {
                if (err) {
                    console.log(err)
                } else {
                    res.render('siswa', {
                        log: rows,
                        title: results[0].name,
                        user: results[0]
                    });
                }
            })
        }
    });
});

router.get('/admin', checkToken, (req, res) => {
    const id = req.user.id
    let admin = `SELECT * FROM admin WHERE id=${id}`
    connection.query(admin, (err, rows) => {
        if (err) {
            console.log(err)
        } else {
            let sql = 'SELECT * FROM user'
            connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                }
                res.render('admin', {
                    title: 'Halaman Admin',
                    records: results,
                    admin_name: rows[0]
                        // nama: results[0].name
                })


            });
        }
    });
});

// router.get('/admin/:id', checkToken, (req, res) => {
//     const id = req.params.id;
//     let sql = `SELECT * FROM user WHERE id=${id}`
//     connection.query(sql, (err, rows) => {
//         if (err) {
//             console.log(err)
//         } else {
//             res.render('poin', {
//                 title: 'Halaman Tambah Poin',
//                 user: rows
//             })
//         }
//     })
// })

module.exports = router;