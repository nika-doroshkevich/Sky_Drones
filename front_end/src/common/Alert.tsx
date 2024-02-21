import React from "react";

type AlertProps = {
    successful: boolean;
    message: string;
};

const Alert: React.FC<AlertProps> = ({successful, message}) => {
    return (
        <div>
            {successful ? (
                <div className="form-group mt-3">
                    <div className="alert alert-success" role="alert">
                        {message}
                    </div>
                </div>
            ) : (
                message && (
                    <div className="form-group mt-3">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Alert;
