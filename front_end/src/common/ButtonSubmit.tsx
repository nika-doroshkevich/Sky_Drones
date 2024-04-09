import React from "react";
import "./Button.css";

type ButtonSubmitProps = {
    loading?: boolean;
    buttonText: string;
    onClick?: () => void;
};

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({loading, buttonText, onClick}) => {
    return (
        <div className="form-group text-center mt-3">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading} onClick={onClick}>
                {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>{buttonText}</span>
            </button>
        </div>
    );
};

export default ButtonSubmit;
