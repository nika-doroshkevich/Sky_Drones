import React, {useEffect, useState} from "react";
import {Navigate, useParams} from "react-router-dom";
import IUser from "../../types/user.type";
import {Form, Formik} from "formik";
import InputField from "../../common/InputField";
import AuthService from "../../services/login-register/auth.service";
import Textarea from "../../common/Textarea";
import Alert from "../../common/Alert";
import handleError from "../../common/ErrorHandler";
import InspectionService from "../../services/inspection.service";
import UserService from "../../services/user.service";
import {inspectionPriorityOptions, InspectionStatus} from "../../common/Constants";
import SelectField from "../../common/SelectField";
import * as Yup from "yup";
import ButtonSubmit from "../../common/ButtonSubmit";
import Modal from "../../common/Modal";

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    message: string;
    successful: boolean;
    isModalOpen: boolean;

    id: any;
    name: string;
    reason: string;
    facility_name: string;
    priority: string;
    pilot: any;
    pilot_username: string;
    inspector: any;
    inspector_username: string;
    status: string;

    userList: IUser[];
};

const InspectionView: React.FC<Props> = () => {
    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {access: ""},
        message: "",
        successful: false,
        isModalOpen: false,

        id: null,
        name: "",
        reason: "",
        facility_name: "",
        priority: "",
        pilot: null,
        pilot_username: "",
        inspector: null,
        inspector_username: "",
        status: "",

        userList: []
    });

    const params = useParams<{ id: string }>();
    const inspectionId = parseInt(params.id || "0", 10);

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

        InspectionService.get(inspectionId)
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    id: response.data.id,
                    name: response.data.name,
                    reason: response.data.reason,
                    facility_name: response.data.facility_name,
                    priority: response.data.priority,
                    pilot_username: response.data.pilot_username,
                    inspector_username: response.data.inspector_username,
                    status: response.data.status,
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });

        if (state.status === InspectionStatus.CREATED && currentUser.role === "EMPLOYEE_OWNER") {
            UserService.getList()
                .then((response) => {
                    setState((prevState) => ({
                        ...prevState,
                        userList: response.data
                    }));
                })
                .catch((error) => {
                    handleError(error, setState);
                });
        }

    }, [inspectionId, state.currentUser.role, state.status]);

    const validationSchema = () => {
        return Yup.object().shape({
            priority: Yup.string().required("This field is required!"),
            pilot: Yup.string().required("This field is required!"),
            inspector: Yup.string().required("This field is required!")
        });
    };

    const handleUpdate = (formValue: {
        id: any;
        priority: string;
        pilot: any;
        inspector: any;
    }) => {
        const {id, priority, pilot, inspector} = formValue;
        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
        }));

        const status = InspectionStatus.IN_PROCESS;

        InspectionService.update(id, priority, pilot, inspector, status)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "The data has been saved successfully!",
                    successful: true,
                    redirect: "/inspection-list"
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const handleOpenModal = () => {
        setState((prevState) => ({
            ...prevState,
            isModalOpen: true
        }));
    }

    const handleCloseModal = () => {
        setState((prevState) => ({
            ...prevState,
            isModalOpen: false
        }));
    }

    const handleConfirmUpdateStatus = () => {
        const id = state.id;

        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
            isModalOpen: false,
            companyIdToJoin: 0
        }));

        const status = InspectionStatus.DONE;

        InspectionService.updateStatus(id, status)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "Inspection has done.",
                    successful: true,
                    redirect: "/inspection-list"
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const {message, successful, currentUser} = state;

    const initialValues = {
        id: state.id,
        name: state.name,
        reason: state.reason,
        facility_name: state.facility_name,
        priority: state.priority || "",
        pilot: "",
        pilot_username: state.pilot_username || "",
        inspector: "",
        inspector_username: state.inspector_username || "",
        status: state.status
    };

    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="col-md-12">
            <Modal
                isOpen={state.isModalOpen}
                onClose={() => handleCloseModal()}
                onConfirm={() => handleConfirmUpdateStatus()}
                message="Are you sure you want to finish this inspection?"
            />
            {state.userReady ? (
                <div className="row">
                    <div className="col-md-6 mx-auto" style={{marginBottom: "20px"}}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleUpdate}
                            enableReinitialize
                        >
                            <Form>
                                {(currentUser.role === "EMPLOYEE_OWNER") && (
                                    <div className="text-center">
                                    </div>
                                )}

                                <InputField label="Name" name="name" type="text" readOnly={true}/>
                                <Textarea label="Reason" name="reason" readOnly={true}/>
                                <InputField label="Facility" name="facility_name" type="text" readOnly={true}/>

                                {(state.status === InspectionStatus.CREATED && state.currentUser.role === "EMPLOYEE_OWNER") ? (
                                    <div>
                                        <SelectField label="Priority" name="priority"
                                                     options={inspectionPriorityOptions}/>

                                        <SelectField
                                            label="Pilot"
                                            name="pilot"
                                            options={state.userList.map(user => ({
                                                value: user.id,
                                                label: user.username!
                                            }))}
                                        />

                                        <SelectField
                                            label="Inspector"
                                            name="inspector"
                                            options={state.userList.map(user => ({
                                                value: user.id,
                                                label: user.username!
                                            }))}
                                        />
                                    </div>
                                ) : (
                                    <div>
                                        <InputField label="Priority" name="priority" type="text" readOnly={true}/>
                                        <InputField label="Pilot" name="pilot_username" type="text" readOnly={true}/>
                                        <InputField label="Inspector" name="inspector_username" type="text"
                                                    readOnly={true}/>
                                    </div>
                                )}

                                <InputField label="Status" name="status" type="text" readOnly={true}/>

                                {(state.status === InspectionStatus.CREATED && state.currentUser.role === "EMPLOYEE_OWNER") && (
                                    <ButtonSubmit buttonText="Accept the request"/>
                                )}

                                {(state.status === InspectionStatus.IN_PROCESS &&
                                    (state.currentUser.role === "EMPLOYEE_OWNER" || state.currentUser.role === "EMPLOYEE")) && (
                                    <ButtonSubmit
                                        buttonText="Done"
                                        onClick={() => handleOpenModal()}
                                    />
                                )}

                                <Alert successful={successful} message={message}/>
                            </Form>
                        </Formik>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default InspectionView;
