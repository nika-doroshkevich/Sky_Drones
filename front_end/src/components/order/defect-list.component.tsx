import React, {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import './defect-list.css';
import IUser from "../../types/user.type";
import AuthService from "../../services/login-register/auth.service";
import {Form, Formik} from "formik";
import Alert from "../../common/Alert";
import InputField from "../../common/InputField";
import {defectSeverityOptions} from "../../common/Constants";
import SelectField from "../../common/SelectField";
import Textarea from "../../common/Textarea";
import ButtonSubmit from "../../common/ButtonSubmit";
import IDefect from "../../types/defect.type";
import handleError from "../../common/ErrorHandler";
import DefectService from "../../services/defect.service";
import IInspection from "../../types/inspection.type";
import InspectionService from "../../services/inspection.service";
import * as Yup from "yup";

type Props = {};

type State = {
    redirect: string | null;
    userReady: boolean;
    currentUser: IUser & { access: string };
    loading: boolean;
    message: string;
    successful: boolean;

    defects: IDefect[];
    inspection: any;
    inspections: IInspection[]
};

const DefectList: React.FC<Props> = () => {
    const [defectsNumber, setDefectsNumber] = useState<number>(0);
    const [imagesUrls, setImagesUrls] = useState<string[]>([]);
    const [state, setState] = useState<State>({
        redirect: null,
        userReady: false,
        currentUser: {access: ""},
        loading: false,
        message: "",
        successful: false,

        defects: [],
        inspection: null,
        inspections: []
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

        const selectedImages = JSON.parse(localStorage.getItem('selectedImagesForReport') || '[]');
        const facilityId = parseInt(localStorage.getItem('facilityId') || '');
        setImagesUrls(selectedImages);
        setDefectsNumber(selectedImages.length);

        InspectionService.getListFilteredByFacilityAndStatus(facilityId)
            .then((response) => {
                setState((prevState) => ({
                    ...prevState,
                    inspections: response.data,
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });

    }, [defectsNumber]);

    const validationSchema = () => {
        return Yup.object().shape({
            inspection: Yup.string().required("This field is required!"),
            defects: Yup.array().of(Yup.object().shape({
                name: Yup.string()
                    .test(
                        "len",
                        "The name must be a maximum of 50 characters.",
                        (val: any) => val.toString().length <= 50)
                    .required("Name is required!"),
                severity: Yup.string().required("Severity is required!"),
                description: Yup.string().required("Description is required!")
            }))
        });
    };

    const handleSubmit = (formValue: {
        inspection: any;
        defects: IDefect[]
    }) => {
        const {inspection, defects} = formValue;
        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
        }));

        for (let index = 0; index < defectsNumber; index++) {
            defects[index].imageUrl = imagesUrls[index];
        }

        DefectService.create(defects, inspection)
            .then(() => {
                setState((prevState) => ({
                    ...prevState,
                    message: "The data has been saved successfully!",
                    successful: true,
                    redirect: `/inspection-view/${inspection}`
                }));
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const generateFields = () => {
        const fields = [];
        for (let index = 0; index < defectsNumber; index++) {
            fields.push(
                <div key={index}>
                    <h5>Defect #{index + 1}</h5>
                    <img className="image" src={imagesUrls[index]} alt={`Defect ${index + 1}`}/>
                    <InputField label="Name" name={`defects[${index}].name`} type="text"/>
                    <SelectField label="Severity" name={`defects[${index}].severity`} options={defectSeverityOptions}/>
                    <Textarea label="Description" name={`defects[${index}].description`}/>
                </div>
            );
        }
        return fields;
    };

    const {message, successful} = state;

    if (state.redirect) {
        return <Navigate to={state.redirect}/>;
    }

    return (
        <div className="col-md-12">
            {(state.userReady) ?
                <div className="row">
                    <div className="col-md-8 mx-auto main">
                        <h3 className="text-center">Description of defects</h3>
                        <Formik
                            initialValues={{
                                inspection: state.inspection || "",
                                defects: Array.from({length: defectsNumber}, () =>
                                    ({name: "", severity: "", description: ""}))
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                {(defectsNumber !== 0) && (
                                    <div>
                                        <SelectField
                                            label="Inspection"
                                            name="inspection"
                                            options={state.inspections.map(inspection => ({
                                                value: inspection.id,
                                                label: inspection.name!
                                            }))}
                                        />
                                        {generateFields()}
                                        <ButtonSubmit buttonText="Next"/>
                                    </div>
                                )}
                                <Alert successful={successful} message={message}/>
                            </Form>
                        </Formik>
                    </div>
                </div> : null}
        </div>
    );
};

export default DefectList;
