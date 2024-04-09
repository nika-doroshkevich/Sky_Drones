import {Component} from "react";
import {Link, Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./App.css";

import AuthService from "./services/login-register/auth.service";
import IUser from './types/user.type';

import Login from "./components/login-register/login.component";
import Register from "./components/login-register/register.component";
import Home from "./components/home/home.component";
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
import InspectionViewUpdate from "./components/inspection/inspection-view-update.component";
import DefectList from "./components/report/defect-list.component";

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
                <nav className="navbar navbar-expand navbar-dark navbar-custom">

                    <button className="btn" type="button" data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <Link to={"/"} className="navbar-brand">
                        Skyward Ventures
                    </Link>
                    <div className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <Link to={"/home"} className="nav-link">
                                Home
                            </Link>
                        </li>

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/inspection-list"} className="nav-link">
                                    Inspection list
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

                        {currentUser && (
                            <li className="nav-item">
                                <Link to={"/facility-list"} className="nav-link">
                                    Facility list
                                </Link>
                            </li>
                        )}

                    </div>

                    {currentUser ? (
                        <div className="navbar-nav ms-auto">
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
                        <div className="navbar-nav ms-auto">
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

                {currentUser && (
                    <div className="offcanvas offcanvas-start offcanvas-dark offcanvas-custom" tabIndex={-1}
                         id="offcanvasExample"
                         aria-labelledby="offcanvasExampleLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title text-light" id="offcanvasExampleLabel">Skyward Ventures</h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"
                                    aria-label="Close"></button>
                        </div>
                        <div className="offcanvas-body">
                            <div className="text-light">

                                {customer && (
                                    <Link to={"/facility-create"} className="nav-link offcanvasItem">
                                        New facility
                                    </Link>
                                )}

                                {showOwnerBoard && (
                                    <Link to={"/users"} className="nav-link offcanvasItem">
                                        Owner Board
                                    </Link>
                                )}

                                {showOwnerBoard && (
                                    <Link to={"/company-create"} className="nav-link offcanvasItem">
                                        New company
                                    </Link>
                                )}

                                {showOwnerBoard && (
                                    <Link to={"/company-update"} className="nav-link offcanvasItem">
                                        Update company
                                    </Link>
                                )}

                                {currentUser && (
                                    <Link to={"/join-company"} className="nav-link offcanvasItem">
                                        Join company
                                    </Link>
                                )}

                            </div>
                        </div>
                    </div>
                )}
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
                    <Route path="/inspection-view/:id" element={<InspectionViewUpdate/>}/>
                    <Route path="/defect-list" element={<DefectList/>}/>
                </Routes>
            </div>
        );
    }
}

export default App;