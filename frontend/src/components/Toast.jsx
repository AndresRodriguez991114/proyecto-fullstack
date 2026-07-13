import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const Toast = ({ show, type = "success", title, message, onClose }) => {

    useEffect(() => {

        if (!show) return;

        const timer = setTimeout(() => {

            onClose();

        }, 3500);

        return () => clearTimeout(timer);

    }, [show, onClose]);

    if (!show) return null;

    return (

        <div className={`toast-card ${type}`}>

            <div className="toast-content">

                <strong>

                    {type === "success"

                        ? <CheckCircle size={18} style={{ marginRight: 6 }} />

                        : <XCircle size={18} style={{ marginRight: 6 }} />
                    }

                    {title}

                </strong>

                <p>{message}</p>

            </div>

            <button
                className="toast-close"
                onClick={onClose}
            >
                <X size={18}/>
            </button>

        </div>

    );

};

export default Toast;