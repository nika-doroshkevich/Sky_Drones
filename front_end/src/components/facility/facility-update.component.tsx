import React, {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
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
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    loading: boolean;
    message: string;
    successful: boolean;

    id: any;
    latitude: number;
    longitude: number;

    name: string;
    type: string;
    location: string;
    description: string;
    company: number;
};

const FacilityUpdate: React.FC<Props> = () => {
    const [state, setState] = useState<State>({
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
        company: 0,
    });

    const params = useParams<{ id: string }>();
    const facilityId = parseInt(params.id || "0", 10);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();

        if (!currentUser) {
            setState((prevState) => ({
                ...prevState,
                redirect: "/home",
            }));
        } else {
            setState((prevState) => ({
                ...prevState,
                currentUser,
                userReady: true,
            }));
        }

        FacilityService.get(facilityId)
            .then((response) => {
                const latitude = parseFloat(response.data.latitude);
                const longitude = parseFloat(response.data.longitude);

                setState((prevState) => ({
                    ...prevState,
                    id: response.data.id,
                    latitude,
                    longitude,
                    name: response.data.name,
                    type: response.data.type,
                    location: response.data.location,
                    description: response.data.description,
                    company: response.data.company,
                }));
            })
            .catch((error) => {
                const resMessage =
                    error.response?.data?.detail || error.message || error.toString();
                console.log("resMessage " + resMessage);
                setState((prevState) => ({
                    ...prevState,
                    successful: false,
                    message: resMessage,
                }));

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            });
    }, [facilityId]);

    const validationSchema = () => {
        return Yup.object().shape({
            latitude: Yup.string().required(
                "This field is required! Please point a location on the map."
            ),
            longitude: Yup.string().required(
                "This field is required! Please point a location on the map."
            ),
            name: Yup.string().required("This field is required!"),
            type: Yup.string().required("This field is required!"),
        });
    };

    const handleUpdate = (formValue: {
        id: number;
        latitude: number;
        longitude: number;
        name: string;
        type: string;
        location: string;
        description: string;
        company: number;
    }) => {
        const {id, latitude, longitude, name, type, location, description, company} =
            formValue;
        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
        }));

        FacilityService.update(id, latitude, longitude, name, type, location, description, company)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "The data has been saved successfully!",
                    successful: true,
                }));
            })
            .catch((error) => {
                const resMessage =
                    error.response?.data?.detail || error.message || error.toString();
                console.log("resMessage " + resMessage);
                setState((prevState) => ({
                    ...prevState,
                    successful: false,
                    message: resMessage,
                }));
            });
    };

    const handleMarkerPositionChange = (latitude: number, longitude: number) => {
        setState((prevState) => ({
            ...prevState,
            latitude,
            longitude,
        }));
    };

    const {loading, message, successful, latitude, longitude} = state;

    const initialValues = {
        id: state.id,
        latitude: state.latitude,
        longitude: state.longitude,
        name: state.name,
        type: state.type,
        location: state.location,
        description: state.description,
        company: state.company,
    };

    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="col-md-12">
            {state.userReady ? (
                <div className="row">
                    <div className="col-md-6">
                        <MapComponent
                            latitude={latitude}
                            longitude={longitude}
                            onMarkerPositionChange={handleMarkerPositionChange}
                            isMarker={true}
                        />
                    </div>
                    <div className="col-md-6">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleUpdate}
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
                </div>
            ) : null}
        </div>
    );
};

export default FacilityUpdate;
