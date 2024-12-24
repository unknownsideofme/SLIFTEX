import { Component } from "react";
import "./navbarStyle.css";
import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";


class Navbar extends Component{
    state = {clicked : false};
    handleClick = () =>{
        this.setState({
            clicked: !this.state.clicked
        })
    }
    handleSignUp = () => {
        this.props.navigate("/register");
      };
    render(){
        const { isLoggedIn, handleLogout } = this.props;
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">Sliftex</h1>


                 <div className="menu-icons" onClick={this.handleClick}>
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
                 </div> 
                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                    {
                        MenuItems.map((item,index)=>{
                            return(
                                <li key={index}>
                                    <Link className={item.cName} to={item.url}>
                                    <i className={item.icon}></i> {item.title}
                                    </Link>
                                </li>
                            )
                        })
                    }
                 <button className="b"><Link to = "/signUp">Sign Up</Link></button>
                </ul>
            </nav>
        )
    }
}
export default Navbar;