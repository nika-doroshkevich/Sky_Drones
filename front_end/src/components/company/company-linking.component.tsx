import {Component} from "react";
import EventBus from "../../common/EventBus";
import IUser from "../../types/user.type";
import UserService from "../../services/user.service";
import ICompany from "../../types/company.type";
import AuthService from "../../services/login-register/auth.service";
import CompanyService from "../../services/company.service";
import {Navigate} from "react-router-dom";
import Modal from "../../common/Modal";
import Alert from "../../common/Alert";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { access: string }
    loading: boolean,
    message: string,
    successful: boolean,
    isModalOpen: boolean,

    companies: ICompany[],
    companyIdToJoin: number
}

export default class CompanyLinking extends Component<Props, State> {
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

            companies: [],
            companyIdToJoin: 0
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/home"});
        this.setState({currentUser: currentUser, userReady: true})

        let companyType;
        if (currentUser.role === "EMPLOYEE_OWNER" || currentUser.role === "EMPLOYEE")
            companyType = "INSPECTING";
        else companyType = "INSPECTED";
        CompanyService.getCompaniesByType(companyType).then(
            response => {
                this.setState({
                    companies: response.data
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

    handleOpenModal(companyId: number) {
        this.setState({
            isModalOpen: true,
            companyIdToJoin: companyId
        });
    }

    handleCloseModal() {
        this.setState({
            isModalOpen: false,
            companyIdToJoin: 0
        });
    }

    handleConfirmJoin() {
        const companyId = this.state.companyIdToJoin;

        this.setState({
            message: "",
            successful: false,
            isModalOpen: false,
            companyIdToJoin: 0
        });

        const currentUser = AuthService.getCurrentUser();
        const userId = currentUser.id;
        const email = currentUser.email;

        UserService.joinCompany(
            userId,
            email,
            companyId
        ).then(
            () => {
                this.setState({
                    message: "You have successfully joined the company!",
                    successful: true
                });
            },
            error => {
                const resMessage = error.response.data.detail ||
                    error.message ||
                    error.toString();
                console.log("resMessage " + resMessage);
                this.setState({
                    successful: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect}/>
        }

        const {loading, message, successful} = this.state;

        return (
            <div className="container">
                <Modal
                    isOpen={this.state.isModalOpen}
                    onClose={() => this.handleCloseModal()}
                    onConfirm={() => this.handleConfirmJoin()}
                    message="Are you sure you want to join this company?"
                />
                {(this.state.userReady) ?
                    <header className="jumbotron">
                        <h3>Companies</h3>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Index</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Website</th>
                                <th>Link</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.companies.map((company, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{company.name}</td>
                                    <td>{company.phone}</td>
                                    <td>{company.website}</td>
                                    <td>
                                        <div className="form-group">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-block"
                                                disabled={loading}
                                                onClick={() => this.handleOpenModal(company.id)}
                                            >
                                                {loading && (
                                                    <span className="spinner-border spinner-border-sm"></span>
                                                )}
                                                <span>Join the company</span>
                                            </button>
                                        </div>
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
