import React from "react";
import {ErrorMessage, Field} from "formik";

type InputFieldProps = {
    label: string;
    name: string;
    type: string;
    disabled?: boolean;
    readOnly?: boolean;
};

const InputField: React.FC<InputFieldProps> = ({label, name, type, disabled, readOnly}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Field
                name={name}
                type={type}
                className="form-control"
                placeholder={label}
                disabled={disabled}
                readOnly={readOnly}
            />
            <ErrorMessage
                name={name}
                component="div"
                className="alert alert-danger"
            />
        </div>
    );
};

export default InputField;
