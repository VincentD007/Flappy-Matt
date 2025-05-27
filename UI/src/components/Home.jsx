import { useParams } from "react-router-dom";
import '../styles/Home.css';
import logo from '../images/thunderbolt.png'

export default function Home() {
    const { username } = useParams();

    return(
        <div className="HomeContainer">
            <NavBar username={username}/>
            <div className="HomeBody">
                <img className='ThunderBolt' alt='ThunderBolt' src={logo}/>
                <div className="PlayGameButton Button">Play Game</div>
                <div className="SettingsButton Button">Settings</div>
            </div>
        </div>
    )
}


function NavBar(props) {
    const { username } = props;

    return(
        <div className="NavContainer">
            Hi
        </div>
    )
}