import React from "react";
import { AlertTriangle } from "lucide-react";

const ConfirmModal = ({
    show,
    title,
    message,
    confirmText = "Eliminar",
    cancelText = "Cancelar",
    onConfirm,
    onCancel
}) => {

    if (!show) return null;

    return (

        <div className="modal-overlay show">

            <div className="modal-box">

                <div className="modal-header">

                    <h2
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <AlertTriangle color="#f59e0b" />
                        {title}
                    </h2>

                </div>

                <p
                    style={{
                        marginTop: 15,
                        marginBottom: 25,
                        lineHeight: 1.6
                    }}
                >
                    {message}
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px"
                    }}
                >

                    <button
                        className="config-boton"
                        style={{
                                        background: "var(--input-bg)",
                                        color: "var(--text)",
                                        border: "1px solid var(--input-border)",
                                        fontWeight: "600"
                        }}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="config-boton config-boton-danger"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default ConfirmModal;