import { useParams, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import '../styles/Home.css';
import logo from '../images/thunderbolt.png';
import PhaserGame from './PhaserGame.jsx';
import Scores from './Scores.jsx';

export default function Home() {
    const { username } = useParams();
    const [displayed, setDisplayed] = useState("home");
    const [bodyJSX, setbodyJSX] = useState(null);

    useEffect(() => {
        switch (displayed) {
            case 'home':
                setbodyJSX(
                    <div className="HomeBody">
                        <img className='ThunderBolt' alt='ThunderBolt' src={logo} />
                        <div onClick={setDisplayed('game')} className="PlayGameButton Button">Play Game</div>
                        <div className="SettingsButton Button">Settings</div>
                    </div>
                )
                break;
            case 'scores':
                setbodyJSX(<Scores/>)
                break;
            case 'game':
                // <PhaserGame/>
                setbodyJSX(<div>gamewefwefewf</div>)
                break;
    }
    }, [displayed])


    return (
        <div className="HomeContainer">
            <NavBar username={username} setDisplayed={setDisplayed} />
            {bodyJSX}
            {/* <div className="HomeBody">
                <img className='ThunderBolt' alt='ThunderBolt' src={logo}/>
                <div onClick={setDisplayed('game')} className="PlayGameButton Button">Play Game</div>
                <div className="SettingsButton Button">Settings</div>
            </div> */}
        </div>
    )
}


function NavBar(props) {
    const { username, setDisplayed } = props;

    return (
        <div className="NavContainer">
            <ul className="Links">
                <li onClick={() => { setDisplayed('home') }}>Home</li>
                <li onClick={() => { setDisplayed('scores') }}>Scores</li>
            </ul>
            <div className="UsernameLogout">
                <div className="UsernameLabel">{`${username}`}</div>
                <div className="LogoutButton">Logout</div>
            </div>
        </div>
    )
}
