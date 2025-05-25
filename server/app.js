const express = require('express');
const app = express();
const port = 8080;
import cookieParser from 'cookie-parser';
import {v4 as uuidv4} from 'uuid'
import bcrypt from 'bcrypt'

app.use(express.json(), cookieParser())


app.get('/Login', (req, res) => {
    let {username, passord} = req.body
    try {
        if (!username || !passord) {
        
    }
    }
    catch(Err) {
        console.log(Err.name)
    }
})


app.listen(port, '0.0.0.0', () => {console.log(`Listening on port ${port}`)})