import { useState, useRef } from 'react';
import '../styles/Login.css';

export default function Login() {
    const [NotificationStyle, setNotificationStyle] = useState({visibility: 'hidden', color: 'green'});
    const [UserName, setUserName] = useState('');
    const [Password, setPassword] = useState('');
    const notification = useRef('');

    return (
        <form id='LoginContainer' onSubmit={(event => {event.preventDefault();})}>
            <h1>Flappy Matt</h1>
            <input 
            onChange={event => {setUserName(event.target.value)}}
            className='UserInput'
            type='text'
            required={true}
            placeholder='Username'/>
            <input 
            onChange={event => {setPassword(event.target.value)}}
            className='UserInput'
            type='password'
            required={true}
            placeholder='Password'/>
            <input type='submit' value='Login' className='Button' 
                onClick={async () => {
                    const response = await 
                    fetch('http://localhost:8080/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({username: UserName, password: Password})
                    })

                    if (!response.ok) {
                        switch (true) {
                            case response.status == 404:
                                notification.current = 'User not found'
                                break;
                            case response.status == 401:
                                notification.current = 'Invalid credentials'
                                break;
                            default:
                                notification.current = 'Something went wrong'
                        }
                        setNotificationStyle({visibility: 'visible', color: 'red'});
                        setTimeout(() => {
                            setNotificationStyle({visibility: 'hidden', color: 'green'});
                            notification.current = '';
                        }, 5000)
                        return;
                    }
                    
                }}/>
            <input type='submit' value='Register' className='Button' 
                onClick={async () => {
                    const response = await
                    fetch('http://localhost:8080/accounts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({username: UserName, password: Password})
                    })

                    if (!response.ok) {
                        switch (true) {
                            case response.status == 409:
                                notification.current = `Username has been taken`
                                break;
                            default:
                                notification.current = 'Something went wrong'
                        }
                        setNotificationStyle({visibility: 'visible', color: 'red'});
                        setTimeout(() => {
                            setNotificationStyle({visibility: 'hidden', color: 'green'});
                            notification.current = '';
                        }, 5000);
                        return;
                    }
                    setNotificationStyle({visibility: 'visible', color: 'green'});
                        setTimeout(() => {
                            setNotificationStyle({visibility: 'hidden', color: 'green'});
                            notification.current = '';
                        }, 5000);
                }}/>
            <div id='Notification' 
            style={{visibility: NotificationStyle.visibility, color: NotificationStyle.color}}
            >{notification.current}</div>
        </form>
    )
}
