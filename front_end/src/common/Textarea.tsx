import React from "react";
import {ErrorMessage, Field} from "formik";

type InputFieldProps = {
    label: string;
    name: string;
};

const Textarea: React.FC<InputFieldProps> = ({label, name}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Field
                as="textarea"
                name={name}
                className="form-control"
                rows="3"
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
