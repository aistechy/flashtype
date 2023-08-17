import React from "react";
import logo from './../../assets/logo.png';
import "./Nav.css";

const Nav = () => {
    return (
        <div className="nav-container">
            <div className="nav-left">
                <img className="flash-logo" src={logo} alt="logo" />
                <p className="flash-logo-text">FlashType</p>

            </div>
            <div className="nav-right">
                <a
                    target="-blank"
                    className="nav-aistechy-link"
                    href="https://aistechy.com.ng"
                    rel="noreferrer"


                >
                    AISTECHY
                </a>

            </div>

        </div>
    );
}


export default Nav;