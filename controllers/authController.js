const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async (req, res) => {
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({'message': 'Username and password are required.'});

    const foundUser = usersDB.users.find(u => u.username === username);
    if (!foundUser) return res.sendStatus(401); // Unauthorized

    const match = await bcrypt.compare(password, foundUser.password);

    if(!match) return res.sendStatus(401);

    // create JWT
    const accessToken = jwt.sign(
        {'username': username},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30s'}
    );
    const refreshToken = jwt.sign(
        {'username': username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    );

    const updatedUsers = usersDB.users.map(u => (u.username !== username) ? u : {...u, refreshToken});
    usersDB.setUsers(updatedUsers)
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    ).catch(err => res.status(500).json({'message': err.message}))


    res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 1000 * 60 * 60 * 24})
    res.json({accessToken})

}

module.exports = {handleLogin}

