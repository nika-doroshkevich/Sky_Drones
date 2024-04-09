import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import IUser from "../../types/user.type";
import {Form, Formik} from "formik";
import * as Yup from "yup";
import InputField from "../../common/InputField";
import FacilityService from "../../services/facility.service";
import AuthService from "../../services/login-register/auth.service";
import Textarea from "../../common/Textarea";
import ButtonSubmit from "../../common/ButtonSubmit";
import Alert from "../../common/Alert";
import handleError from "../../common/ErrorHandler";
import IFacility from "../../types/facility.type";
import InspectionService from "../../services/inspection.service";
import SelectField from "../../common/SelectField";

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    loading: boolean;
    message: string;
    successful: boolean;

    name: string;
    reason: string;
    facility: any;

    facilityList: IFacility[];
};

const InspectionCreate: React.FC<Props> = () => {
    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {access: ""},
        loading: false,
        message: "",
        successful: false,

        name: "",
        reason: "",
        facility: null,

        facilityList: []
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
                    facilityList: response.data,
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    }, []);

    const validationSchema = () => {
        return Yup.object().shape({
            name: Yup.string()
                .test(
                    "len",
                    "The name must be a maximum of 50 characters.",
                    (val: any) => val.toString().length <= 50
                )
                .required(
                    "This field is required!"
                ),
            reason: Yup.string().required(
                "This field is required!"
            ),
            facility: Yup.string().required("This field is required!"),
        });
    };

    const handleCreate = (formValue: {
        name: string;
        reason: string;
        facility: any;
    }) => {
        const {name, reason, facility} =
            formValue;
        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
        }));

        InspectionService.create(name, reason, facility)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "The data has been saved successfully!",
                    successful: true,
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const {loading, message, successful} = state;

    const initialValues = {
        name: "",
        reason: "",
        facility: ""
    };


    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="container mt-4 col-md-12">
            {state.userReady ? (
                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleCreate}
                            enableReinitialize
                        >
                            <Form>
                                <InputField label="Name" name="name" type="text"/>
                                <Textarea label="Reason" name="reason"/>

                                <SelectField
                                    label="Facility"
                                    name="facility"
                                    options={state.facilityList.map(facility => ({
                                        value: facility.id,
                                        label: facility.name
                                    }))}
                                />

                                <ButtonSubmit loading={loading} buttonText="Request an inspection"/>
                                <Alert successful={successful} message={message}/>
                            </Form>
                        </Formik>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default InspectionCreate;
