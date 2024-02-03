import React from "react";
import {ErrorMessage, Field} from "formik";

type InputFieldProps = {
    label: string;
    name: string;
    type: string;
    disabled?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({label, name, type, disabled}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Field name={name} type={type} className="form-control" disabled={disabled}/>
            <ErrorMessage
                name={name}
                component="div"
                className="alert alert-danger"
            />
        </div>
    );
};

export default InputField;
