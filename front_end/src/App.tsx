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
import JoinCompany from "./components/company/company-linking.component";
import BoardOwner from "./components/user/board-owner.component";
import Company from "./components/company/company-create.component";

import EventBus from "./common/EventBus";
import CompanyUpdate from "./components/company/company-update.component";

type Props = {};

type State = {
    showOwnerBoard: boolean,
    currentUser: IUser | undefined
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
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
            showOwnerBoard: false,
            currentUser: undefined,
        });
    }

    render() {
        const {currentUser, showOwnerBoard} = this.state;

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

                        {showOwnerBoard && (
                            <li className="nav-item">
                                <Link to={"/users"} className="nav-link">
                                    Owner Board
                                </Link>
                            </li>
                        )}

                        {showOwnerBoard && (
                            <li className="nav-item">
                                <Link to={"/company-create"} className="nav-link">
                                    New company
                                </Link>
                            </li>
                        )}

                        {showOwnerBoard && (
                            <li className="nav-item">
                                <Link to={"/company-update"} className="nav-link">
                                    Update company
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/join-company"} className="nav-link">
                                    Join company
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
                        <Route path="/join-company" element={<JoinCompany/>}/>
                        <Route path="/users" element={<BoardOwner/>}/>
                        <Route path="/company-create" element={<Company/>}/>
                        <Route path="/company-update" element={<CompanyUpdate/>}/>
                    </Routes>
                </div>

                { /*<AuthVerify logOut={this.logOut}/> */}
            </div>
        );
    }
}

export default App;