import React, {useEffect, useState} from "react";
import {Link, Navigate} from "react-router-dom";
import IUser from "../../types/user.type";
import AuthService from "../../services/login-register/auth.service";
import Alert from "../../common/Alert";
import handleError from "../../common/ErrorHandler";
import InspectionService from "../../services/inspection.service";
import IInspection from "../../types/inspection.type";

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    loading: boolean;
    message: string;
    successful: boolean;

    inspectionList: IInspection[];
};

const InspectionList: React.FC<Props> = () => {
    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {access: ""},
        loading: false,
        message: "",
        successful: false,

        inspectionList: []
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

        InspectionService.getList()
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    inspectionList: response.data,
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    }, []);

    const {message, successful, currentUser} = state;


    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="container">
            {(state.userReady) ?
                <header className="jumbotron">
                    <h3>Our inspections</h3>
                    <div>
                        {(currentUser.role === "CUSTOMER_OWNER") && (
                            <Link to={`/request-an-inspection`}
                                  className="btn btn-primary btn-block">
                                <span>Request an inspection</span>
                            </Link>
                        )}
                    </div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Index</th>
                            <th>Name</th>
                            <th>Facility</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Detail</th>
                        </tr>
                        </thead>
                        <tbody>
                        {state.inspectionList.map((inspection, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{inspection.name}</td>
                                <td>{inspection.facility_name}</td>
                                <td>{inspection.priority}</td>
                                <td>{inspection.status}</td>
                                <td>
                                    <Link to={`/inspection-view/${inspection.id}`}
                                          className="btn btn-primary btn-block">
                                        <span>Detail</span>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <Alert successful={successful} message={message}/>
                </header> : null}
        </div>
    );
};

export default InspectionList;
