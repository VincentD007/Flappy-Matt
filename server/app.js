const express = require('express');
const app = express();
const port = 8080;
const knex = require('./knex.js');
const { InvalidBody, InvalidCredentials, UserAlreadyExists, InvalidSession } = require('./errors');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
app.use(express.json(), cookieParser());
var sessions = {};


app.post('/login', async (req, res) => {
    let {username, password} = req.body;
    try {
        if (!username || !password) {
            throw new InvalidBody();
        }
        const user = await knex('accounts').where({ username }).first();
        if(!user) throw new InvalidCredentials();

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new InvalidCredentials();

        if (req.cookies['SessionID']) {delete sessions[req.cookies['SessionID']]}; //Removes any previous session established by the requesting client
        for (let key of Object.keys(sessions)) { //Removes any previous sessions established by the account on different clients
            if (sessions[key].username == username) {
                delete sessions[key];
            };
        };

        let sessionId = uuidv4();
        while (sessions[sessionId]) {
            sessionId = uuidv4();
        }

        sessions[sessionId] = {
            userId: user.userId,
            username: user.username,
            created: Date.now()
        };

        res.cookie('SessionID', sessionId, {
            httpOnly: true,
            https: true,
            sameSite: 'strict'
        });
        res.status(200).send({ message: `Welcome, ${user.username}!` });
    }
    catch (Err) {
        switch (true) {
            case Err.name === 'InvalidBody':
                res.status(422).send('Invalid username or password')
                break;
            case Err.name === 'InvalidCredentials':
                res.status(401).send('Incorrect username or password')
                break;
            default:
                console.error(Err);
                res.status(500).send('Internal Server Error')
        }
    }
});


app.post('/logout', (req, res) => {
    const { username } = req.body;
    const clientSession = req.cookies['SessionID'];
    try {
        if (!username) {
            throw new InvalidBody()
        };

        if (!clientSession) {
            throw new InvalidSession()
        };

        if (!sessions[clientSession].username == username) {
            throw new InvalidSession()
        };

        delete sessions[clientSession];
        res.status(200).send(`Session Ended`);
    }
    catch(Err) {
        switch (true) {
            case Err.name == 'InvalidBody':
                res.status(422).send('Bad Request')
                break;
            case Err.name == 'InvalidSession':
                res.status(401).send('Invalid Session')
                break;
            default:
                console.error(Err);
                res.status(500).send('Internal Server Error')
        };
    };
});


app.post('/accounts', async (req, res) => {
    let {username, password} = req.body;
    try {
        if (!username || !password) {
            throw new InvalidBody();
        }
        else if (typeof username != 'string' || typeof password != 'string') {
            throw new InvalidBody();
        }

        let hashedPassword = await bcrypt.hash(password, 12);
        let rows = await knex('accounts')
        .insert({username: username, password: hashedPassword})
        .returning('*')
        .onConflict('username').ignore();

        if (rows.length == 0) {
            throw new UserAlreadyExists();
        };

        let userID = rows[0].userId;

        let insertedScore = await knex('scores')
        .insert({user_id: userID, distance: 0})
        .returning('*');
        
        let scoresID = insertedScore[0].scores_id
        await knex('scores_crayons')
        .insert([
            {score_id: scoresID, crayon_id: 1, amount: 0},
            {score_id: scoresID, crayon_id: 2, amount: 0}, 
            {score_id: scoresID, crayon_id: 3, amount: 0},
            {score_id: scoresID, crayon_id: 4, amount: 0}
        ])

        res.status(200).send(`Account created for ${username}`);
    }
    catch(Err) {
        switch (true) {
            case Err.name == 'InvalidBody':
                res.status(422).send('Bad Request')
                break;
            case Err.name == 'UserAlreadyExists':
                res.status(409).send(`${username} already exists`)
                break;
            default:
                console.log(Err)
                res.status(500).send('Internal Server Error') 
        }
    }
})

app.listen(port, '0.0.0.0', () => {console.log(`Listening on port ${port}`)})
