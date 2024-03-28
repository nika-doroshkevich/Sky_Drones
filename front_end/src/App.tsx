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
import CompanyUpdate from "./components/company/company-update.component";
import FacilityCreate from "./components/facility/facility-create.component";
import FacilityUpdate from "./components/facility/facility-update.component";
import FacilityList from "./components/facility/facility-list.component";
import FacilityMap from "./components/facility/facility-map.component";
import FacilityView from "./components/facility/facility-view.component";
import FacilityData from "./components/facility-data/facility-data.component";
import InspectionCreate from "./components/inspection/inspection-create.component";
import InspectionList from "./components/inspection/inspection-list.component";
import InspectionView from "./components/inspection/inspection-view-update.component";

import EventBus from "./common/EventBus";

type Props = {};

type State = {
    currentUser: IUser | undefined,
    customer: boolean,
    showOwnerBoard: boolean
}

class App extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.logOut = this.logOut.bind(this);

        this.state = {
            currentUser: undefined,
            customer: false,
            showOwnerBoard: false
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                customer: user.role === "CUSTOMER_OWNER" || user.role === "CUSTOMER",
                showOwnerBoard: user.role === "EMPLOYEE_OWNER" || user.role === "CUSTOMER_OWNER"
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
            currentUser: undefined,
            customer: false,
            showOwnerBoard: false,
        });
    }

    render() {
        const {currentUser, showOwnerBoard, customer} = this.state;

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

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/facility-list"} className="nav-link">
                                    Facility list
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/facility-map"} className="nav-link">
                                    Facility map
                                </Link>
                            </li>
                        )}

                        {customer && (
                            <li className="nav-item">
                                <Link to={"/facility-create"} className="nav-link">
                                    New facility
                                </Link>
                            </li>
                        )}

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/inspection-list"} className="nav-link">
                                    Inspection list
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
                        <Route path="/facility-create" element={<FacilityCreate/>}/>
                        <Route path="/facility-update/:id" element={<FacilityUpdate/>}/>
                        <Route path="/facility-list" element={<FacilityList/>}/>
                        <Route path="/facility-map" element={<FacilityMap/>}/>
                        <Route path="/facility-view/:id" element={<FacilityView/>}/>
                        <Route path="/facility-data/:facilityId" element={<FacilityData/>}/>
                        <Route path="/request-an-inspection" element={<InspectionCreate/>}/>
                        <Route path="/inspection-list" element={<InspectionList/>}/>
                        <Route path="/inspection-view/:id" element={<InspectionView/>}/>
                    </Routes>
                </div>
            </div>
        );
    }
}

export default App;