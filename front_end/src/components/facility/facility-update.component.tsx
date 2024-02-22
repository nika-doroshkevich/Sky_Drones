import React, {Component} from "react";
import {Navigate} from "react-router-dom";
import IUser from "../../types/user.type";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../../common/InputField";
import MapComponent from "../map.component";
import FacilityService from "../../services/facility.service";
import SelectField from "../../common/SelectField";
import {facilityTypeOptions} from "../../common/Constants";
import AuthService from "../../services/login-register/auth.service";
import Textarea from "../../common/Textarea";
import ButtonSubmit from "../../common/ButtonSubmit";
import Alert from "../../common/Alert";
import EventBus from "../../common/EventBus";

type Props = {};

type State = {
    redirect: string | null,
    userReady: boolean,
    currentUser: IUser & { access: string }
    loading: boolean,
    message: string,
    successful: boolean,

    id: any,
    latitude: number,
    longitude: number,

    name: string,
    type: string,
    location: string,
    description: string,
    company: number
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

            id: null,
            latitude: 0,
            longitude: 0,

            name: "",
            type: "",
            location: "",
            description: "",
            company: 0
        };

        this.handleUpdate = this.handleUpdate.bind(this);
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

        const facilityId = 1;

        FacilityService.get(facilityId).then(
            response => {
                const latitude = parseFloat(response.data.latitude);
                const longitude = parseFloat(response.data.longitude);

                this.setState({
                    id: response.data.id,
                    latitude: latitude,
                    longitude: longitude,
                    name: response.data.name,
                    type: response.data.type,
                    location: response.data.location,
                    description: response.data.description,
                    company: response.data.company
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
        id: number;
        latitude: number;
        longitude: number;
        name: string;
        type: string;
        location: string;
        description: string;
        company: number
    }) {
        const {id, latitude, longitude, name, type, location, description, company} = formValue;
        this.setState({
            message: "",
            successful: false
        });

        FacilityService.update(
            id,
            latitude,
            longitude,
            name,
            type,
            location,
            description,
            company
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
        this.setState({
            latitude,
            longitude
        });
    };


    render() {
        if (this.state.redirect) {
            return <Navigate to={this.state.redirect}/>
        }

        const {loading, message, successful, latitude, longitude} = this.state;

        const initialValues = {
            id: this.state.id,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            name: this.state.name,
            type: this.state.type,
            location: this.state.location,
            description: this.state.description,
            company: this.state.company
        };

        return (
            <div className="col-md-12">
                {(this.state.userReady) ?
                    <div className="row">
                        <div className="col-md-6">
                            <MapComponent
                                latitude={latitude}
                                longitude={longitude}
                                onMarkerPositionChange={this.handleMarkerPositionChange}
                                isMarker={true}
                            />
                        </div>
                        <div className="col-md-6">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={this.validationSchema}
                                onSubmit={this.handleUpdate}
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

                                    <ButtonSubmit loading={loading} buttonText="Update"/>
                                    <Alert successful={successful} message={message}/>

                                </Form>
                            </Formik>
                        </div>
                    </div> : null}
            </div>
        );
    }
}
