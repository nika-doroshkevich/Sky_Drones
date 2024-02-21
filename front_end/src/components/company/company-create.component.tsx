import React, {Component} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "../../services/login-register/auth.service";
import IUser from "../../types/user.type";
import EventBus from "../../common/EventBus";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../../common/InputField";
import CompanyService from "../../services/company.service";
import ICompany from "../../types/company.type";
import Alert from "../../common/Alert";
import ButtonSubmit from "../../common/ButtonSubmit";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { access: string }
    loading: boolean,
    message: string,
    successful: boolean,

    inspectingCompanies: ICompany[],

    id: number,
    name: string,
    phone: string,
    website: string,
    companyType: string,
    inspectingCompany: any
}
export default class Company extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {access: ""},
            loading: false,
            message: "",
            successful: false,

            inspectingCompanies: [],

            id: 0,
            name: "",
            phone: "",
            website: "",
            companyType: "",
            inspectingCompany: null
        };

        this.handleCreate = this.handleCreate.bind(this);
    }

    validationSchema() {
        return Yup.object().shape({
            name: Yup.string()
                .required("This field is required!"),
            phone: Yup.string()
                .required("This field is required!"),
            website: Yup.string()
                .required("This field is required!"),
            companyType: Yup.string()
                .required("This field is required!"),
        });
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/home"});
        this.setState({currentUser: currentUser, userReady: true})

        CompanyService.getCompaniesByType('INSPECTING').then(
            response => {
                console.log("response " + response.status);
                this.setState({
                    inspectingCompanies: response.data
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

    handleCreate(formValue: {
        name: string;
        phone: string;
        website: string;
        companyType: string;
        inspectingCompany: any
    }) {
        const {name, phone, website, companyType, inspectingCompany} = formValue;
        this.setState({
            message: "",
            successful: false
        });

        CompanyService.create(
            name,
            phone,
            website,
            companyType,
            inspectingCompany
        ).then(
            response => {
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
            name: "",
            phone: "",
            website: "",
            companyType: "",
            inspectingCompanies: "",
            inspectingCompany: ""
        };

        return (
            <div className="col-md-12">
                <div className="card card-container">
                    {(this.state.userReady) ?
                        <div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={this.validationSchema}
                                onSubmit={this.handleCreate}
                                enableReinitialize
                            >
                                <Form>

                                    <InputField label="Name" name="name" type="text"/>
                                    <InputField label="Phone" name="phone" type="text"/>
                                    <InputField label="Website" name="website" type="text"/>

                                    <div className="form-group">
                                        <label htmlFor="companyType">Company type</label>
                                        <Field
                                            name="companyType"
                                            as="select"
                                            className="form-control"
                                        >
                                            <option value="" disabled>Select a company type</option>
                                            <option value="INSPECTING">INSPECTING</option>
                                            <option value="INSPECTED">INSPECTED</option>
                                        </Field>
                                        <ErrorMessage
                                            name="companyType"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="inspectingCompany">Inspecting company</label>
                                        <Field
                                            name="inspectingCompany"
                                            as="select"
                                            className="form-control"
                                        >
                                            <option value="" disabled>Select an inspecting company</option>
                                            {this.state.inspectingCompanies.map(company => (
                                                <option key={company.id} value={company.id}>{company.name}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage
                                            name="inspectingCompany"
                                            component="div"
                                            className="alert alert-danger"
                                        />
                                    </div>

                                    <ButtonSubmit loading={loading} buttonText={"Create"}/>
                                    <Alert successful={successful} message={message}/>

                                </Form>
                            </Formik>
                        </div> : null}
                </div>
            </div>
        );
    }
}
