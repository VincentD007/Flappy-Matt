import '../styles/Login.css';

export default function Login() {
    return (
        <div id='LoginContainer'>
            <h1>Flappy Matt</h1>
            <input 
            id='UserInput'
            type='text'
            required='true'
            placeholder='Username'></input>
            <input 
            id='UserInput'
            type='password'
            required='true'
            placeholder='Password'></input>
            <div className='Button'>Login</div>
            <div className='Button'>Register</div>
        </div>
    )
}
