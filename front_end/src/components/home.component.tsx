import {Component} from "react";

import MainService from "../services/main.service";

type Props = {};

type State = {
    content: string;
}

export default class Home extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            content: ""
        };
    }

    componentDidMount() {
        MainService.getPublicContent().then(
            response => {
                this.setState({
                    //content: response.data
                    content: "Hello!"
                });
            },
            error => {
                this.setState({
                    content:
                        (error.response && error.response.data) ||
                        error.message ||
                        error.toString()
                });
            }
        );
    }

    render() {
        return (
            <div className="container">
                <header className="jumbotron">
                    {/*<h3>{this.state.content}</h3>*/}
                    <h3>Hello!</h3>
                </header>
            </div>
        );
    }
}
