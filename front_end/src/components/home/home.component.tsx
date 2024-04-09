import {Component} from "react";
import "./home.css";

type Props = {};

export default class Home extends Component<Props> {

    componentDidMount() {
    }

    render() {
        return (
            <div className="container-fullscreen">
                <p className="text-light text-custom-header">Let's conquer the skies together!</p>
                <p className="text-light text-custom">Skyward Ventures helps you store, process, and visualize </p>
                <p className="text-light text-custom">aerial imagery data with ease and precision.</p>
            </div>
        );
    }
}
