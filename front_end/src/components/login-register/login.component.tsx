import {Component} from "react";
import {Navigate} from "react-router-dom";
import {Form, Formik} from "formik";
import * as Yup from "yup";

import AuthService from "../../services/login-register/auth.service";
import InputField from "../../common/InputField";

type Props = {};

type State = {
    redirect: string | null,
    email: string,
    password: string,
    loading: boolean,
    message: string
};

export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);

        this.state = {
            redirect: null,
            email: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (currentUser) {
            // this.setState({redirect: "/profile"});
            console.log("currentUser " + JSON.stringify(currentUser));
            this.setState({redirect: ""});
        }
        ;
    }

    componentWillUnmount() {
        window.location.reload();
    }

    validationSchema() {
        return Yup.object().shape({
            email: Yup.string().required("This field is required!"),
            password: Yup.string().required("This field is required!"),
        });
    }

    handleLogin(formValue: { email: string; password: string }) {
        const {email, password} = formValue;

        console.log("formValue " + formValue);
        console.log("email, password " + email + " " + password);

        this.setState({
            message: "",
            loading: true
        });


        AuthService.login(email, password).then(
            () => {
                this.setState({
                    redirect: "/profile"
                    // redirect: "/home"
                });
            },
            error => {
                const resMessage =
                    (error.response.data.detail) ||
                    error.message ||
                    error.toString();

                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect}/>
        }

        const {loading, message} = this.state;

        const initialValues = {
            email: "",
            password: "",
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    <img
                        src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                        alt="profile-img"
                        className="profile-img-card"
                    />

                    <Formik
                        initialValues={initialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleLogin}
                    >
                        <Form>

                            <InputField label="Email" name="email" type="text"/>
                            <InputField label="Password" name="password" type="password"/>

                            <div className="form-group text-center mt-3">
                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Login</span>
                                </button>
                            </div>

                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }
}
