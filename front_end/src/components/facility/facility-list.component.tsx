import {Component} from "react";
import EventBus from "../../common/EventBus";
import IUser from "../../types/user.type";
import AuthService from "../../services/login-register/auth.service";
import {Link, Navigate} from "react-router-dom";
import Alert from "../../common/Alert";
import IFacility from "../../types/facility.type";
import FacilityService from "../../services/facility.service";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { access: string }
    loading: boolean,
    message: string,
    successful: boolean,
    isModalOpen: boolean,

    facilities: IFacility[],
    companyIdToJoin: number
}

export default class FacilityList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {access: ""},
            loading: false,
            message: "",
            successful: false,
            isModalOpen: false,

            facilities: [],
            companyIdToJoin: 0
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/home"});
        this.setState({currentUser: currentUser, userReady: true})

        FacilityService.getList().then(
            response => {
                this.setState({
                    facilities: response.data
                });
            },
            error => {
                this.setState({
                    message:
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                });

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect}/>
        }

        const {loading, message, successful, currentUser} = this.state;

        return (
            <div className="container">
                {(this.state.userReady) ?
                    <header className="jumbotron">
                        <h3>Our facilities</h3>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Index</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Description</th>
                                <th>View</th>
                                {(currentUser.role === "CUSTOMER_OWNER" || currentUser.role === "CUSTOMER") && (
                                    <th>Update</th>
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.facilities.map((facility, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{facility.name}</td>
                                    <td>{facility.type}</td>
                                    <td>{facility.location}</td>
                                    <td>{facility.description}</td>
                                    <td>
                                        <Link to={`/facility-view/${facility.id}`}
                                              className="btn btn-primary btn-block">
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>View</span>
                                        </Link>
                                    </td>
                                    <td>
                                        {(currentUser.role === "CUSTOMER_OWNER" || currentUser.role === "CUSTOMER") && (
                                            <Link to={`/facility-update/${facility.id}`}
                                                  className="btn btn-secondary btn-block">
                                                {loading && (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                                <span>Update</span>
                                            </Link>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <Alert successful={successful} message={message}/>
                    </header> : null}
            </div>
        );
    }
}
