import React from "react";

type ButtonSubmitProps = {
    loading: boolean;
    buttonText: string;
};

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({loading, buttonText}) => {
    return (
        <div className="form-group text-center mt-3">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>{buttonText}</span>
            </button>
        </div>
    );
};

export default ButtonSubmit;
