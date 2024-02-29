import React from "react";
import {ErrorMessage, Field} from "formik";

type InputFieldProps = {
    label: string;
    name: string;
    readOnly?: boolean;
};

const Textarea: React.FC<InputFieldProps> = ({label, name, readOnly}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Field
                as="textarea"
                name={name}
                className="form-control"
                rows="3"
                placeholder={label}
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

export default Textarea;
