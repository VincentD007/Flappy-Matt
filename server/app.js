const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const knex = require('./knex.js');
const { InvalidBody, InvalidCredentials, UserAlreadyExists, InvalidSession, NotFound } = require('./errors.js');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
app.use(express.json(), cookieParser(), cors());
var sessions = {};


app.post('/login', async (req, res) => {
    let {username, password} = req.body;
    try {
        if (!username || !password) {
            throw new InvalidBody();
        }
        const user = await knex('accounts').where({ username }).first();
        if(!user) throw new NotFound();

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
            case Err.name === 'NotFound':
                res.status(404).send('Not Found')
            default:
                console.error(Err);
                res.status(500).send('Internal Server Error')
        }
    }
});


app.post('/logout', (req, res) => {
    const { username } = req.body;
    const clientSession = req.cookies['SessionID'];
    console.log(clientSession)
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


// app.put('/accounts', async (req, res) => {
//     const sessionId = req.cookies['SessionId'];
//     const {password} = req.body;
//     try {
//         if (!sessionId || !session[sessionId]) throw new InvalidSession();
//         if (!password) throw new InvalidBody();

//         const hashed = await bcrypt.hash(password, 12);
//         await knex('accounts')
//             .where({username: sessions[sessionId].username})
//             .update({password: hashed});
//         res.status(200).send("Password updated.")
//     } catch (Err) {
//         res.status(500).send("Update failed.")
//     }  
// });


// app.get('/accounts/:username', async (req, res) => {
//     const { username } = req.body;
//     try {
//         const user = await knex('accounts')
//             .select('username', 'userId')
//             .where({username})
//             .first();
//         if(!user) throw new NotFound();
//         res.status(200).json(user);
//     } catch (Err1) {
//         res.status(404).send('User not found');
//     }  
// });

// app.get('/stats/:username', async (req, res) => {
//     const { username } = req.params;

//     try {
//         const user = await knex('accounts').where({ username }).first();
//         if (!user) throw new NotFound();
        
//         const score = await knex('scores')
//             .where({ user_id: user.userId })
//             .first();

//         if (!score) throw new NotFound();

//         const crayons = await knex('scores_crayons')
//             .join('crayons', 'scores_crayons.crayon_id', '=', 'crayons.crayon_id')
//             .select('crayons.color', 'scores_crayons.amount')
//             .where({ score_id: score.scores_id });

//         res.status(200).json({
//             username: user.username,
//             distance: score.distance,
//             crayons: crayons 
//         });
//     } catch (Err) {
//         switch (true) {
//             case Err.name === 'NotFound':
//                 res.status(404).send('User not found');
//                 break;
//             default:
//                 console.error(Err);
//                 res.status(500).send('Internal Server Error');
//         }
//     }
// });
//     app.delete('/accounts', async (req, res) => {
//         const sessionId = req.cookies['SessionId'];
//         try {
//             if (!sessionId || !sessions[sessionId]) throw new InvalidSession();
//             const {userId} = sessions[sessionId];
//             await knex('scores_crayons').whereIn('score_id',
//                 knex('scores').select('scores_id').where({user_id: userId})
//             ).del();
//            await knex('scores').where({user_id: userId}).del();
//            await knex('accounts').where({userId}).del();
//            delete sessions[sessionId];
//            res.status(200).send("Account deleted."); 
//         } catch (Err){
//             console.error(Err)
//             res.status(500).send("Failed to delete account.");
//         }
//     });

//     app.put('/stats', async (req, res) => {
//         const sessionId = req.cookies['SessionId'];
//         const {distance, crayons} = req.body;

//         try{
//             if (!sessionId || !sessions[sessionId]) throw new InvalidSession();
//             const user = sessions[sessionId];
//             const score = await knex('scores').where({user_id: user.userId}).first();
//             if (!score) throw new NotFound();
//             if (typeof distance === 'number') {
//                 await knex('scores')
//                     .where({user_id: user.userId})
//                     .update({distance})
//             }
//             if (Array.isArray(crayons)) {
//                 for (const crayon of crayons) {
//                     await knex('scores_crayons')
//                         .where({score_id: scores.scores_id, crayon_id: crayon.crayon_id})
//                         .update({amount: crayon.amount});
//                 }
//             }
//             res.status(200).send("Stats updated.");
//         } catch (Err) {
//             console.error(Err);
//             res.status(500).send("Failed to update stats.");
//         }
//     });

//     app.get('/leaderboard/top5', async (req, res) => {
//         const sessionId = req.cookies['SessionId'];
//         try {
//             if (!sessionId || !sessions[sessionId]) throw new InvalidSession();
//             const topUsers = await knex('accounts')
//                 .join('scores', 'accounts.userId', '=', 'scores.user_id')
//                 .select('accounts.username', 'scores.distance')
//                 .orderBy('scores.distance', 'desc')
//                 .limit(5);
//             res.status(200).json({
//                 leaderboard: topUsers
//             });
//         } catch (Err) {
//             switch (true) {
//                 case Err.name === 'InvalidSession':
//                     res.status(401).send('Invalid Session');
//                     break;
//                 default:
//                     console.error(Err);
//                     res.status(500).send('Internal Server Error');    
//             }
//         }
//     });


app.listen(port, '0.0.0.0', () => {console.log(`Listening on port ${port}`)})
