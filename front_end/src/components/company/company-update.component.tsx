import {Component} from "react";
import {Navigate} from "react-router-dom";
import AuthService from "../../services/login-register/auth.service";
import IUser from "../../types/user.type";
import EventBus from "../../common/EventBus";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../../common/InputField";
import CompanyService from "../../services/company.service";
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
    name: string,
    phone: string,
    website: string,
    companyType: string,
    inspectingCompanyId: number,
    inspectingCompanyName: string
}
export default class CompanyUpdate extends Component<Props, State> {
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
            name: "",
            phone: "",
            website: "",
            companyType: "",
            inspectingCompanyId: 0,
            inspectingCompanyName: ""
        };

        this.handleUpdate = this.handleUpdate.bind(this);
    }

    validationSchema() {
        return Yup.object().shape({
            name: Yup.string()
                .required("This field is required!"),
            phone: Yup.string()
                .required("This field is required!"),
            website: Yup.string()
                .required("This field is required!"),
        });
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/home"});
        this.setState({currentUser: currentUser, userReady: true})

        CompanyService.getCompanyByUser(currentUser.id).then(
            response => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    phone: response.data.phone,
                    website: response.data.website,
                    companyType: response.data.company_type,
                    inspectingCompanyId: response.data.inspecting_company
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

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevState.inspectingCompanyId !== this.state.inspectingCompanyId && this.state.inspectingCompanyId !== null) {
            CompanyService.getCompany(this.state.inspectingCompanyId).then(
                response => {
                    this.setState({
                        inspectingCompanyName: response.data.name || null
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
    }

    handleUpdate(formValue: {
        id: number,
        name: string;
        phone: string;
        website: string;
        companyType: string;
        inspectingCompanyId: number;

    }) {
        const {id, name, phone, website, companyType, inspectingCompanyId} = formValue;
        this.setState({
            message: "",
            successful: false
        });

        CompanyService.update(
            id,
            name,
            phone,
            website,
            companyType,
            inspectingCompanyId
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
            name: this.state.name,
            phone: this.state.phone,
            website: this.state.website,
            companyType: this.state.companyType || "",
            inspectingCompanyId: this.state.inspectingCompanyId,
            inspectingCompanyName: this.state.inspectingCompanyName || ""
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

                                    <InputField label="Name" name="name" type="text"/>
                                    <InputField label="Phone" name="phone" type="text"/>
                                    <InputField label="Website" name="website" type="text"/>
                                    <InputField label="Company type" name="companyType" type="text" disabled/>
                                    <InputField label="Inspecting company" name="inspectingCompanyName" type="text"
                                                disabled/>

                                    <div className="form-group text-center mt-3">
                                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                            {loading && (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            )}
                                            <span>Update</span>
                                        </button>
                                    </div>

                                    <Alert successful={successful} message={message}/>

                                </Form>
                            </Formik>
                        </div> : null}
                </div>
            </div>
        );
    }
}
