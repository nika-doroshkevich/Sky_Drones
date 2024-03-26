import React, {useEffect, useState} from "react";
import {Link, Navigate, useParams} from "react-router-dom";
import IUser from "../../types/user.type";
import {Form, Formik} from "formik";
import InputField from "../../common/InputField";
import FacilityService from "../../services/facility.service";
import AuthService from "../../services/login-register/auth.service";
import Textarea from "../../common/Textarea";
import Alert from "../../common/Alert";
import handleError from "../../common/ErrorHandler";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

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

const FacilityView: React.FC<Props> = () => {
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
                    latitude: latitude,
                    longitude: longitude,
                    name: response.data.name,
                    type: response.data.type,
                    location: response.data.location,
                    description: response.data.description,
                    company: response.data.company,
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    }, [facilityId]);

    const {message, successful, latitude, longitude, currentUser} = state;

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
                        {latitude !== 0 && longitude !== 0 && (
                            <MapContainer center={[latitude, longitude]} zoom={15} style={{height: '450px'}}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                                <Marker position={[latitude, longitude]}>
                                    <Popup>Your facility is here</Popup>
                                </Marker>
                            </MapContainer>
                        )}
                    </div>
                    <div className="col-md-6">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={() => {
                            }}
                            enableReinitialize
                        >
                            <Form>
                                {(currentUser.role === "EMPLOYEE_OWNER" || currentUser.role === "EMPLOYEE") && (
                                    <div className="text-center">
                                        <Link to={`/facility-data/${facilityId}`}
                                              className="btn btn-secondary btn-block">
                                            <span>Add data</span>
                                        </Link>
                                    </div>
                                )}

                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <InputField label="Latitude" name="latitude" type="text" readOnly={true}/>
                                        </div>
                                        <div className="col-md-6">
                                            <InputField label="Longitude" name="longitude" type="text" readOnly={true}/>
                                        </div>
                                    </div>
                                </div>

                                <InputField label="Name" name="name" type="text" readOnly={true}/>
                                <InputField label="Facility type" name="type" type="text" readOnly={true}/>
                                <InputField label="Location" name="location" type="text" readOnly={true}/>
                                <Textarea label="Description" name="description" readOnly={true}/>

                                <Alert successful={successful} message={message}/>
                            </Form>
                        </Formik>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default FacilityView;
