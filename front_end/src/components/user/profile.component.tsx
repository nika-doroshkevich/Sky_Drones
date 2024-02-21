import React, {Component} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "../../services/login-register/auth.service";
import IUser from "../../types/user.type";
import EventBus from "../../common/EventBus";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import UserService from "../../services/user.service";
import InputField from "../../common/InputField";
import SelectField from "../../common/SelectField";
import {titleOptions} from "../../common/Constants";
import ButtonSubmit from "../../common/ButtonSubmit";
import Alert from "../../common/Alert";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { access: string }
    loading: boolean,
    message: string,
    successful: boolean,

    id: number,
    title: string,
    username: string,
    email: string,
    phone: string,
    jobTitle: string,
    status: string,
    role: string
}
export default class Profile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {access: ""},
            loading: false,
            message: "",
            successful: false,

            id: 0,
            title: "",
            username: "",
            email: "",
            phone: "",
            jobTitle: "",
            status: "",
            role: ""
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    validationSchema() {
        return Yup.object().shape({
            title: Yup.string()
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
            phone: Yup.string()
                .required("This field is required!"),
            jobTitle: Yup.string()
                .required("This field is required!"),
        });
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/home"});
        this.setState({currentUser: currentUser, userReady: true})

        UserService.getUser().then(
            response => {
                console.log("response " + response.status);
                this.setState({
                    id: response.data.id,
                    title: response.data.title || "",
                    username: response.data.username,
                    email: response.data.email,
                    phone: response.data.phone || "",
                    jobTitle: response.data.job_title || "",
                    status: response.data.status,
                    role: response.data.role
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

    handleUpdate(formValue: {
        id: number,
        title: string;
        username: string;
        email: string;
        phone: string;
        jobTitle: string
    }) {
        const {id, title, username, email, phone, jobTitle} = formValue;
        this.setState({
            message: "",
            successful: false
        });

        UserService.update(
            id,
            title,
            username,
            email,
            phone,
            jobTitle
        ).then(
            () => {
                this.setState({
                    message: "The data has been saved successfully!",
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

        const initialValues = {
            id: this.state.id,
            title: this.state.title || "",
            username: this.state.username,
            email: this.state.email,
            phone: this.state.phone || "",
            jobTitle: this.state.jobTitle || "",
            role: this.state.role
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    {(this.state.userReady) ?
                        <div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={this.validationSchema}
                                onSubmit={this.handleUpdate}
                                enableReinitialize
                            >
                                <Form>

                                    <SelectField label="Title" name="title" options={titleOptions}/>
                                    <InputField label="Username" name="username" type="text"/>
                                    <InputField label="Email" name="email" type="text" disabled/>
                                    <InputField label="Phone" name="phone" type="text"/>
                                    <InputField label="Job title" name="jobTitle" type="text"/>
                                    <InputField label="Role" name="role" type="text" disabled/>

                                    <ButtonSubmit loading={loading} buttonText="Update"/>
                                    <Alert successful={successful} message={message}/>

                                </Form>
                            </Formik>
                        </div> : null}
                </div>
            </div>
        );
    }
}
