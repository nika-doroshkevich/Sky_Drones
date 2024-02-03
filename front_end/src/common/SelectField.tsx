import React from "react";
import {ErrorMessage, Field} from "formik";

type SelectFieldProps = {
    label: string;
    name: string;
    options: { value: string; label: string }[];
};

const SelectField: React.FC<SelectFieldProps> = ({label, name, options}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <Field
                name={name}
                as="select"
                className="form-control"
            >
                <option value="" disabled>Select a {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </Field>
            <ErrorMessage
                name={name}
                component="div"
                className="alert alert-danger"
            />
        </div>
    );
};

export default SelectField;
