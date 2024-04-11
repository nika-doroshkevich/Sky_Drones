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
import {defectSeverityOptions, inspectionPriorityOptions, InspectionStatus} from "../../common/Constants";
import SelectField from "../../common/SelectField";
import * as Yup from "yup";
import ButtonSubmit from "../../common/ButtonSubmit";
import Modal from "../../common/Modal";
import ReportService from "../../services/report.service";
import IDefectModel from "../../types/defect-model.type";
import DefectService from "../../services/defect.service";

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    loading: boolean;
    message: string;
    successful: boolean;
    isInspectionFinishModalOpen: boolean;
    isDeleteDefectModalOpen: boolean;

    id: any;
    name: string;
    reason: string;
    facility: any;
    facility_name: string;
    priority: string;
    pilot: any;
    pilot_username: string;
    inspector: any;
    inspector_username: string;
    status: string;

    userList: IUser[];
    reportUrl: string;

    defects: IDefectModel[];
    defectIdToDelete: any;
};

const InspectionView: React.FC<Props> = () => {
    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {access: ""},
        loading: false,
        message: "",
        successful: false,
        isInspectionFinishModalOpen: false,
        isDeleteDefectModalOpen: false,

        id: null,
        name: "",
        reason: "",
        facility: null,
        facility_name: "",
        priority: "",
        pilot: null,
        pilot_username: "",
        inspector: null,
        inspector_username: "",
        status: "",

        userList: [],
        reportUrl: "",

        defects: [],
        defectIdToDelete: null
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
                    facility: response.data.facility,
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

        ReportService.get(inspectionId)
            .then((response) => {
                const responseData: any = response.data;
                setState((prevState) => ({
                    ...prevState,
                    reportUrl: responseData.data
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

        if (state.status === InspectionStatus.IN_PROCESS &&
            (currentUser.role === "EMPLOYEE_OWNER" || currentUser.role === "EMPLOYEE")) {
            DefectService.getList(state.id)
                .then((response) => {
                    setState((prevState) => ({
                        ...prevState,
                        defects: response.data
                    }));
                })
                .catch((error) => {
                    handleError(error, setState);
                });
        }

    }, [inspectionId, state.currentUser.role, state.defects.length, state.id, state.status]);

    const validationSchema = () => {
        return Yup.object().shape({
            priority: Yup.string().required("This field is required!"),
            pilot: Yup.string().required("This field is required!"),
            inspector: Yup.string().required("This field is required!")
        });
    };

    const handleUpdateInspection = (formValue: {
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

    const handleDoReport = () => {
        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
            loading: true
        }));

        const inspectionId = state.id;
        ReportService.create(inspectionId)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "The report was created successfully!",
                    successful: true,
                    loading: false
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const handleInspectionFinishOpenModal = () => {
        setState((prevState) => ({
            ...prevState,
            isInspectionFinishModalOpen: true
        }));
    }

    const handleDeleteDefectOpenModal = (defectId: any) => {
        setState((prevState) => ({
            ...prevState,
            isDeleteDefectModalOpen: true,
            defectIdToDelete: defectId
        }));
    }

    const handleCloseModal = (modal: string) => {
        if (modal === "inspectionFinish") {
            setState((prevState) => ({
                ...prevState,
                isInspectionFinishModalOpen: false
            }));
        }
        if (modal === "deleteDefect") {
            setState((prevState) => ({
                ...prevState,
                isDeleteDefectModalOpen: false
            }));
        }
    }

    const handleConfirmUpdateStatus = () => {
        const id = state.id;

        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
            isInspectionFinishModalOpen: false,
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

    const handleConfirmDeleteDefect = () => {
        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
            isDeleteDefectModalOpen: false
        }));

        const defectId = state.defectIdToDelete;

        DefectService.delete(defectId)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "The defect has been successfully deleted.",
                    successful: true
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const generateFields = () => {
        return state.defects.map((defect, index) => (
            <div key={index} className="mt-3 mb-5">

                <div className="col-md-12">
                    <div className="row">
                        <div className="col-md-11">
                            <h5>Defect #{index + 1}</h5>
                        </div>
                        <div className="col-md-1">
                            <button type="submit" className="btn-close btn-close-black"
                                    aria-label="Close" onClick={() => handleDeleteDefectOpenModal(defect.id)}></button>
                        </div>
                    </div>
                </div>

                <img className="image" src={state.defects[index].file_storage_item_path!} alt={`Defect ${index + 1}`}/>
                <InputField label="Name" name={`defects[${index}].name`} type="text" readOnly={true}/>
                <SelectField label="Severity" name={`defects[${index}].severity`}
                             options={defectSeverityOptions} disabled={true}/>
                <Textarea label="Description" name={`defects[${index}].description`} readOnly={true}/>
            </div>
        ));
    };

    const {message, successful, loading, reportUrl} = state;

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
        status: state.status,

        defects: state.defects || []
    };

    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="container mt-4 col-md-12">
            <Modal
                isOpen={state.isInspectionFinishModalOpen}
                onClose={() => handleCloseModal("inspectionFinish")}
                onConfirm={() => handleConfirmUpdateStatus()}
                message="Are you sure you want to finish this inspection?"
            />
            <Modal
                isOpen={state.isDeleteDefectModalOpen}
                onClose={() => handleCloseModal("deleteDefect")}
                onConfirm={() => handleConfirmDeleteDefect()}
                message="Are you sure you want to delete this defect?"
            />
            {state.userReady ? (
                <div className="row">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleUpdateInspection}
                        enableReinitialize
                    >
                        <Form>
                            <div className="col-md-6 mb-4 mx-auto">
                                {(reportUrl !== null) && (
                                    <div className="text-center">
                                        <a className="btn btn-secondary" href={reportUrl}>Download the report</a>
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
                                    <div className="col-md-12">
                                        <div className="row">
                                            <div className="col-md-6">
                                                {(reportUrl !== null) ? (
                                                    <ButtonSubmit
                                                        loading={loading}
                                                        buttonText="Create a new report"
                                                        onClick={() => handleDoReport()}
                                                    />
                                                ) : (
                                                    <ButtonSubmit
                                                        loading={loading}
                                                        buttonText="Create a report"
                                                        onClick={() => handleDoReport()}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-6">
                                                <ButtonSubmit
                                                    buttonText="Done"
                                                    onClick={() => handleInspectionFinishOpenModal()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Alert successful={successful} message={message}/>
                            </div>

                            {(state.status === InspectionStatus.IN_PROCESS &&
                                (state.currentUser.role === "EMPLOYEE_OWNER" || state.currentUser.role === "EMPLOYEE")) && (
                                <div className="col-md-8 mb-3 mx-auto">
                                    <h3 className="text-center">Description of defects</h3>
                                    {generateFields()}
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            ) : null}
        </div>
    );
};

export default InspectionView;
