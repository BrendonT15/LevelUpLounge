import { Link } from "react-router-dom"
const Header = () => {
    return(
        <div className="header-container">
            <h1>LevelUp Lounge</h1>
            <nav className="nav">
                <h2><Link to="/">Home</Link></h2>
                <h2><Link to="/create">Create Post</Link></h2>
            </nav>
         </div>
    );
}

export default Header;