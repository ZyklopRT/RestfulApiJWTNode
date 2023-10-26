const usersDB = {
    users: require('../models/users.json'),
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const  {username, password} = req.body;
    if (!username || !password) return res.status(400).json({'message': 'Username and password are required.'});

    const duplicate = usersDB.users.find(u => u.username === username);
    if (duplicate) return res.sendStatus(409); // Conflict

    try {
        const hashedPwd = await bcrypt.hash(password, 10);

        const newUser = {username: username, password: hashedPwd}
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(usersDB.users)
        ).catch(err => res.status(500).json({'message': err.message}))
        console.log(usersDB.users);
        return res.status(201).json({'success' : 'Created user!'})
    } catch (err) {
        return res.status(500).json({'message': err.message})
    }
}

module.exports = {handleNewUser}