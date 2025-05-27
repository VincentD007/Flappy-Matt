import { useParams } from "react-router-dom";

export default function Home() {
    const { username } = useParams();

    return(
        <div>
            {`Homepage for ${username}`}
        </div>
    )
}
