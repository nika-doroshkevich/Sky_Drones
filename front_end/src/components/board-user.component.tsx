import {Component} from "react";

import MainService from "../services/main.service";
import EventBus from "../common/EventBus";

type Props = {};

type State = {
    content: string;
}

export default class BoardUser extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        MainService.getUserBoard().then(
            response => {
                console.log("response " + response.status);
                this.setState({
                    content: response.data.email
                });
            },
            error => {
                this.setState({
                    content:
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
                    <h3>{this.state.content}</h3>
                </header>
            </div>
        );
    }
}
