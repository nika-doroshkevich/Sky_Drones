import {Component} from "react";
import EventBus from "../../common/EventBus";
import IUser from "../../types/user.type";
import UserService from "../../services/user.service";
import Modal from "../../common/Modal";
import Alert from "../../common/Alert";

type Props = {};

type State = {
    loading: boolean;
    message: string;
    user: IUser[];

    successful: boolean;
    isModalOpen: boolean;
    userIdToMakeInactive: number;
    userEmailToMakeInactive: string
}

export default class BoardOwner extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            loading: false,
            message: "",
            user: [],

            successful: false,
            isModalOpen: false,
            userIdToMakeInactive: 0,
            userEmailToMakeInactive: ""
        };
    }

    componentDidMount() {
        UserService.getList().then(
            response => {
                this.setState({
                    user: response.data
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

    handleOpenModal(userId: number, userEmail: any) {
        this.setState({
            isModalOpen: true,
            userIdToMakeInactive: userId,
            userEmailToMakeInactive: userEmail
        });
    }

    handleCloseModal() {
        this.setState({
            isModalOpen: false,
            userIdToMakeInactive: 0,
            userEmailToMakeInactive: ""
        });
    }

    handleConfirmJoin() {
        const userId = this.state.userIdToMakeInactive;
        const userEmail = this.state.userEmailToMakeInactive;

        this.setState({
            message: "",
            successful: false,
            isModalOpen: false,
            userIdToMakeInactive: 0,
            userEmailToMakeInactive: ""
        });

        UserService.makeUserInactive(
            userId,
            userEmail
        ).then(
            () => {
                this.setState({
                    message: "User has been deactivated.",
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
        const {loading, message, successful} = this.state;

        return (
            <div className="container mt-4">
                <Modal
                    isOpen={this.state.isModalOpen}
                    onClose={() => this.handleCloseModal()}
                    onConfirm={() => this.handleConfirmJoin()}
                    message="Are you sure you want to deactivate this user?"
                />
                <header className="jumbotron">
                    <h3>Information about users</h3>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Job title</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Deactivation</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.user.map((user, index) => (
                            <tr key={index}>
                                <td>{user.title}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.job_title}</td>
                                <td>{user.status}</td>
                                <td>{user.role}</td>
                                <td>
                                    {user.role !== "EMPLOYEE_OWNER" && user.role !== "CUSTOMER_OWNER" && (
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            disabled={loading}
                                            onClick={() => this.handleOpenModal(user.id, user.email)}
                                        >
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>Deactivate the user</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Alert successful={successful} message={message}/>
                </header>
            </div>
        );
    }
}
