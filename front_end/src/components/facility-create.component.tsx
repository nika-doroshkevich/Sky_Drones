import React, {Component} from "react";
import {Navigate} from "react-router-dom";
import IUser from "../types/user.type";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../common/InputField";
import MapComponent from "./map.component";
import FacilityService from "../services/facility.service";
import SelectField from "../common/SelectField";
import {facilityTypeOptions} from "../common/constants";
import AuthService from "../services/login-register/auth.service";
import Textarea from "../common/Textarea";
import ButtonSubmit from "../common/ButtonSubmit";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { access: string }
    loading: boolean,
    message: string,
    successful: boolean,

    latitude: any,
    longitude: any,

    name: string,
    type: string,
    location: string,
    description: string,
    companyId: any
}
export default class FacilityCreate extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            redirect: null,
            userReady: false,
            currentUser: {access: ""},
            loading: false,
            message: "",
            successful: false,

            latitude: "",
            longitude: "",

            name: "",
            type: "",
            location: "",
            description: "",
            companyId: null
        };

        this.handleCreate = this.handleCreate.bind(this);
    }

    validationSchema() {
        return Yup.object().shape({
            latitude: Yup.string()
                .required("This field is required! Please point a location on the map."),
            longitude: Yup.string()
                .required("This field is required! Please point a location on the map."),
            name: Yup.string()
                .required("This field is required!"),
            type: Yup.string()
                .required("This field is required!"),
        });
    }

    componentDidMount() {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) this.setState({redirect: "/home"});
        this.setState({currentUser: currentUser, userReady: true})
    }

    handleCreate(formValue: {
        latitude: number;
        longitude: number;
        name: string;
        type: string;
        location: string;
        description: string
    }) {
        const {latitude, longitude, name, type, location, description} = formValue;
        this.setState({
            message: "",
            successful: false
        });

        let companyId = this.state.companyId;

        FacilityService.create(
            latitude,
            longitude,
            name,
            type,
            location,
            description,
            companyId
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

    handleMarkerPositionChange = (latitude: number, longitude: number) => {
        console.log("Marker position:", latitude, longitude);
        this.setState({
            latitude,
            longitude
        });
    };


    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect}/>
        }

        const {loading, message, successful} = this.state;

        const initialValues = {
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            name: "",
            type: "",
            location: "",
            description: ""
        };

        console.log("lat + lng " + this.state.latitude + " " + this.state.longitude);

        return (
            <div className="col-md-12">
                {(this.state.userReady) ?
                    <div className="row">
                        <div className="col-md-6">
                            <MapComponent onMarkerPositionChange={this.handleMarkerPositionChange}/>
                        </div>
                        <div className="col-md-6">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={this.validationSchema}
                                onSubmit={this.handleCreate}
                                enableReinitialize
                            >
                                <Form>
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <InputField label="Latitude" name="latitude" type="text"/>
                                            </div>
                                            <div className="col-md-6">
                                                <InputField label="Longitude" name="longitude" type="text"/>
                                            </div>
                                        </div>
                                    </div>

                                    <InputField label="Name" name="name" type="text"/>
                                    <SelectField label="Facility type" name="type" options={facilityTypeOptions}/>
                                    <InputField label="Location" name="location" type="text"/>
                                    <Textarea label="Description" name="description"/>

                                    <ButtonSubmit loading={loading} buttonText="Create"/>

                                    {successful ? (
                                        <div className="form-group mt-3">
                                            <div className="alert alert-success" role="alert">
                                                {message}
                                            </div>
                                        </div>
                                    ) : (
                                        message && (
                                            <div className="form-group mt-3">
                                                <div className="alert alert-danger" role="alert">
                                                    {message}
                                                </div>
                                            </div>
                                        )
                                    )}


                                </Form>
                            </Formik>
                        </div>
                    </div> : null}
            </div>
        );
    }
}