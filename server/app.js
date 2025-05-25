const express = require('express');
const app = express();
const port = 8080;
const knex = require('./knex.js');
const { InvalidBody, InvalidCredentials, UserAlreadyExists } = require('./errors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

app.use(express.json(), cookieParser())

app.get('/Login', (req, res) => {
    let {username, passord} = req.body;
    try {
        if (!username || !passord) {
            throw new InvalidBody()
        }

    }
    catch(Err) {
        return res.status(422).send('Bad Request');
    }
})


app.post('/Accounts', async (req, res) => {
    let {username, password} = req.body;
    try {
        if (!username || !password) {
            throw new InvalidBody();
        }
        else if (typeof username != 'string' || typeof password != 'string') {
            throw new InvalidBody();
        }

        let rows;
        await knex('accounts')
        .insert({username: username, password: password})
        .returning('*')
        .onConflict('username').ignore()
        .then(result => {
            rows = result;
            console.log(result)
        })

        if (rows.length == 0) {
            console.log(rows.length)
            throw new UserAlreadyExists();
        }

        
        res.status(200).send(rows);
    }
    catch(Err) {
        switch (true) {
            case Err.name = 'InvalidBody':
                res.status(404).send('Bad Request')
            case Err.name = 'UserAlreadyExists':
                res.status(409).send(`${username} already exists`)
        }
    }
})

app.listen(port, '0.0.0.0', () => {console.log(`Listening on port ${port}`)})
