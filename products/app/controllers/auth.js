const mongoose = require('mongoose');
const bCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config');

// Функция-обработчик запроса на вход пользователя
const User = mongoose.model('User');

const signIn = (req, res) => {
    const { name, password } = req.body;
    console.log(req.body.name);
    User.findOne({ name })
        .exec()         // tests for a match in a string. This method returns the matched text if it finds a match, otherwise it returns null.
        .then((user) => {
            console.log(user)
            if(!user) {
                res.status(401).json({ message: 'User does not exist.'})
            }
            const isValid = bCrypt.compareSync(password, user.password);// returns true/ false
            if (isValid) {
                console.log(2)
                const token = jwt.sign(user._id.toString(), jwtSecret);
                res.send(token);
            } else {
                res.status(401).send('Invalid credentials!');
            }

        })
        .catch(error => {
            res.status(500).json({message: error.message})
        });
};

module.exports = {
    signIn,
};