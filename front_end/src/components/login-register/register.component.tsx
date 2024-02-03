import {Component} from "react";
import {Form, Formik} from "formik";
import * as Yup from "yup";

import AuthService from "../../services/login-register/auth.service";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";

type Props = {};

type State = {
    email: string,
    username: string,
    password: string,
    role: string,
    successful: boolean,
    message: string
};

export default class Register extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleRegister = this.handleRegister.bind(this);

        this.state = {
            email: "",
            username: "",
            password: "",
            role: "",
            successful: false,
            message: ""
        };
    }

    validationSchema() {
        return Yup.object().shape({
            email: Yup.string()
                .email("This is not a valid email.")
                .required("This field is required!"),
            username: Yup.string()
                .test(
                    "len",
                    "The username must be between 3 and 30 characters.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 3 &&
                        val.toString().length <= 30
                )
                .required("This field is required!"),
            password: Yup.string()
                .test(
                    "len",
                    "The password must be between 8 and 40 characters.",
                    (val: any) =>
                        val &&
                        val.toString().length >= 8 &&
                        val.toString().length <= 40
                )
                .required("This field is required!"),
            role: Yup.string()
                .required("This field is required!"),
        });
    }

    handleRegister(formValue: { email: string; username: string; password: string; role: string }) {
        const {email, username, password, role} = formValue;
        this.setState({
            message: "",
            successful: false
        });

        AuthService.register(
            email,
            username,
            password,
            role
        ).then(
            response => {
                console.log("response " + JSON.stringify(response));
                this.setState({
                    message: "Registration was successful!",
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
        const {successful, message} = this.state;

        const initialValues = {
            email: "",
            username: "",
            password: "",
            role: "",
        };

        const roleOptions = [
            {value: "EMPLOYEE", label: "EMPLOYEE"},
            {value: "CUSTOMER", label: "CUSTOMER"},
            {value: "EMPLOYEE_OWNER", label: "EMPLOYEE_OWNER"},
            {value: "CUSTOMER_OWNER", label: "CUSTOMER_OWNER"},
        ];

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
                        onSubmit={this.handleRegister}
                    >
                        <Form>
                            {!successful && (
                                <div>

                                    <InputField label="Email" name="email" type="email"/>
                                    <InputField label="Username" name="username" type="text"/>
                                    <InputField label="Password" name="password" type="password"/>
                                    <SelectField label="Role" name="role" options={roleOptions}/>

                                    <div className="form-group text-center mt-3">
                                        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                                    </div>
                                </div>
                            )}

                            {message && (
                                <div className="form-group">
                                    <div
                                        className={
                                            successful ? "alert alert-success" : "alert alert-danger"
                                        }
                                        role="alert"
                                    >
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
