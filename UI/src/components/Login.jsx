import { useState, useRef } from 'react';
import '../styles/Login.css';

export default function Login() {
    const [NotificationVisible, setVisibility] = useState('true');
    const notification = useRef('Invalid Credentials');

    return (
        <form id='LoginContainer' onSubmit={(event => {event.preventDefault();})}>
            <h1>Flappy Matt</h1>
            <input 
            className='UserInput'
            type='text'
            required={true}
            placeholder='Username'/>
            <input 
            className='UserInput'
            type='password'
            required={true}
            placeholder='Password'/>
            <input type='submit' value='Login' className='Button' onClick={() => {}}/>
            <input type='submit' value='Register' className='Button'/>
            <div id='Notification' 
            style={{visibility: NotificationVisible}}
            >{notification.current}</div>
        </form>
    )
}
