import {Component} from "react";

import MainService from "../services/main.service";
import EventBus from "../common/EventBus";
import IUser from "../types/user.type";

type Props = {};

type State = {
    message: string;
    user: IUser[]
}

export default class BoardOwner extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            message: "",
            user: []
        };
    }

    componentDidMount() {
        MainService.getOwnerBoard().then(
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

    render() {
        return (
            <div className="container">
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
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </header>
            </div>
        );
    }
}
