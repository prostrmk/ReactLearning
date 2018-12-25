// import Database from "../util/database";
const Database = require('../util/database');
const express = require('express');
const router = express.Router();
const bodyParse = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('../util/database');
const jwt = require("jsonwebtoken");

router.get('/', (req, res, next) => {
    res.render('auth', {action: '/auth', method: 'post'});
});

router.post('/', (req, resp) => {
    let username = req.body.username;
    let password = req.body.password;
    const db = new Database();
    // console.log(username, password);
    if (username.length >= 4 && username.length <= 25 && password.length >= 6 && password.length <= 20) {
        db.executeQuery('SELECT * FROM users WHERE username=?', username).then(user=>{
            console.log(user);
            if (user.length > 0) {
                console.log(user[0].id, user[0].username, user[0].password);
                bcrypt.compare(password, user[0].password, (err, res) => {
                    console.log(res);
                    if (res) {
                        let secret = 'SECRET';
                        jwt.sign({id: user[0].id, username: user[0].username, role: user[0].role}, secret, (err, token) => {
                            return resp.status(200).json({
                                message: "success",
                                token,
                                userId: user[0].id,
                                userRole: user[0].role,
                                companyId: user[0].company_id
                            });
                        });
                    } else {
                        console.log("failed");
                        return resp.status(401).json({message: "Auth Failed"})
                    }
                })
            }else{
                resp.json({error: 'no such user'});
            }
        });
    } else {
        resp.json({error: 'validation'});
    }

});

router.get('/logout', (req, resp) => {
    req.session.destroy(err => {
        console.log(err);
        resp.redirect('/');
    })
});


module.exports = router;
