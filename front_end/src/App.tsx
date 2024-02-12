import {Component} from "react";
import {Link, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/login-register/auth.service";
import IUser from './types/user.type';

import Login from "./components/login-register/login.component";
import Register from "./components/login-register/register.component";
import Home from "./components/home.component";
import Profile from "./components/user/profile.component";
import BoardUser from "./components/board-user.component";
import BoardModerator from "./components/board-moderator.component";
import BoardOwner from "./components/board-owner.component";
import Company from "./components/company.component";

import EventBus from "./common/EventBus";

type Props = {};

type State = {
    showModeratorBoard: boolean,
    showOwnerBoard: boolean,
    currentUser: IUser | undefined
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            showModeratorBoard: false,
            showOwnerBoard: false,
            currentUser: undefined,
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        console.log("user" + JSON.stringify(user));

        if (user) {
            this.setState({
                currentUser: user,
                showOwnerBoard: user.role === "EMPLOYEE_OWNER" || user.role === "CUSTOMER_OWNER",
            });
        }

        EventBus.on("logout", this.logOut);
    }

    componentWillUnmount() {
        EventBus.remove("logout", this.logOut);
    }

    logOut() {
        AuthService.logout();
        this.setState({
            showModeratorBoard: false,
            showOwnerBoard: false,
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, showModeratorBoard, showOwnerBoard} = this.state;

        return (
            <div>
                <nav className="navbar navbar-expand navbar-dark bg-dark">
                    <Link to={"/"} className="navbar-brand">
                        Sky Drones
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link">
                                Home
                            </Link>
                        </li>

                        {showModeratorBoard && (
                            <li className="nav-item">
                                <Link to={"/mod"} className="nav-link">
                                    Moderator Board
                                </Link>
                            </li>
                        )}

                        {showOwnerBoard && (
                            <li className="nav-item">
                                <Link to={"/users"} className="nav-link">
                                    Owner Board
                                </Link>
                            </li>
                        )}

                        {showOwnerBoard && (
                            <li className="nav-item">
                                <Link to={"/company"} className="nav-link">
                                    Company
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/user"} className="nav-link">
                                    User
                                </Link>
                            </li>
                        )}
                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/profile"} className="nav-link">
                                    {currentUser.email}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <a href="/login" className="nav-link" onClick={this.logOut}>
                                    LogOut
                                </a>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">
                                    Sign Up
                                </Link>
                            </li>
                        </div>
                    )}
                </nav>

                <div className="container mt-3">
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/home" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/user" element={<BoardUser/>}/>
                        <Route path="/user" element={<BoardModerator/>}/>
                        <Route path="/users" element={<BoardOwner/>}/>
                        <Route path="/company" element={<Company/>}/>
                    </Routes>
                </div>

                { /*<AuthVerify logOut={this.logOut}/> */}
            </div>
        );
    }
}

export default App;