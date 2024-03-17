import React, {useEffect, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import IUser from "../../types/user.type";
import FacilityService from "../../services/facility.service";
import AuthService from "../../services/login-register/auth.service";
import IFacility from "../../types/facility.type";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import handleError from "../../common/ErrorHandler";

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    loading: boolean;
    message: string;
    successful: boolean;

    facilities: IFacility[];

    id: any;
    latitude: number;
    longitude: number;

    name: string;
    type: string;
    location: string;
    description: string;
    company: number;
};

const FacilityMap: React.FC<Props> = () => {
    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {access: ""},
        loading: false,
        message: "",
        successful: false,

        facilities: [],

        id: null,
        latitude: 0,
        longitude: 0,

        name: "",
        type: "",
        location: "",
        description: "",
        company: 0,
    });

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

        FacilityService.getList()
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    facilities: response.data
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    }, []);

    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="col-md-12">
            {state.userReady ? (
                <div className="container">
                    <MapContainer center={[53.9, 27.5667]} zoom={10} style={{height: '450px'}}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        {state.facilities.map((facility) => (

                            <Marker key={facility.id} position={[facility.latitude, facility.longitude]}>
                                <Popup>
                                    <Link to={`/facility-view/${facility.id}`}
                                          className="btn btn-link btn-block">
                                        <span>{facility.name}</span>
                                    </Link>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            ) : null}
        </div>
    );
};

export default FacilityMap;
