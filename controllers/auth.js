const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../models/db')

exports.register = (req, res) => {
    const { name, jeniskelamin, kelas, jurusan, index, absen, username, password, password2 } = req.body

    connection.query('SELECT username FROM login WHERE username = ?', [username], async(error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render('register', {
                title: 'Register',
                messages: 'Username is already taken!'
            });
        } else if (password !== password2) {
            return res.render('register', {
                title: 'Register',
                messages: 'Password is not match!'
            })
        }

        function between(min, max) {
            return Math.floor(
                Math.random() * (max - min + 1) + min
            )
        }
        const randomId = between(1000, 10000);
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        connection.query('INSERT INTO user SET ?', { id: randomId, name: name, jeniskelamin: jeniskelamin, kelas: kelas, jurusan: jurusan, index: index, absen: absen }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                connection.query('INSERT INTO login SET ?', { id: randomId, username: username, password: hashedPassword, role: 'user' }, (error, results) => {
                    if (error) {
                        console.log(error);
                    } else {
                        res.redirect('/login')
                    }

                })

            }
        })
    });
}

exports.updatePoin = (req, res) => {
    const { id, poin2, poin, keterangan } = req.body

    function sums(input) {

        if (toString.call(input) !== "[object Array]")
            return false;

        var total = 0;
        for (var i = 0; i < input.length; i++) {
            if (isNaN(input[i])) {
                continue;
            }
            total += Number(input[i]);
        }
        return total;
    }
    const sum = sums([poin, poin2])
    let sql = `UPDATE user SET poin=${sum} WHERE id=${id}`
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            connection.query('INSERT INTO log SET ?', { id: id, add_by: "admin", poin_before: poin, poin_add: poin2, poin_now: sum, keterangan: keterangan }, (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    res.redirect('/admin')
                }
            })
        }
    });
}

exports.login = async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).render('login', {
                title: 'Login',
                messages: 'Please provides an username and password!'
            })
        }
        connection.query('SELECT * FROM login WHERE username = ?', [username], async(error, results) => {
            console.log(results[0])
            if (!results[0] || !(await bcrypt.compare(password, results[0].password))) {
                return res.status(401).render('login', {
                    title: 'Login',
                    messages: 'Username or password is incorrect!'
                })
            } else {
                const id = results[0].id;

                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                console.log("the token is " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('loginwithjwt', token, cookieOptions);
                if (results[0].role === 'user') {
                    res.status(200).redirect('/user')
                } else {
                    res.status(200).redirect('/admin')
                }
            }
        })
    } catch (error) {
        console.log(error);
    }
}

exports.checkToken = (req, res, next) => {
    let token = req.cookies.loginwithjwt
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log(err)
            } else {
                req.user = decoded
                next();
            }
        })
    } else {
        res.render('login', {
            messages: 'You are not login yet! Please login first!'
        });
    }
}

exports.authPage = (req, res, next) => {
    let token = req.cookies.loginwithjwt
    if (token != null) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            const id = decoded.id
            let sql = `SELECT role FROM login WHERE id=${id}`
            connection.query(sql, (err, results) => {
                if (results[0].role != "user") {
                    return res.redirect('/admin')
                } else {
                    return res.redirect('/user')
                }
            })
        })
    } else {
        next();
    }
}