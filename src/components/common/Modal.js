import React from "react";
import styles from "./Modal.module.sass";
import { IoClose } from "react-icons/io5";

const Modal = ({
                   isOpen,
                   title,
                   children,
                   onClose,
                   footer,
                   variant = "default", // "default" | "prompt"
                   fullscreenOnMobile = true,
               }) => {
    if (!isOpen) return null;

    return (
        <div
            className={`${styles.overlay} ${
                variant === "prompt" ? styles.promptOverlay : ""
            }`}
        >
            <div
                className={`${styles.modal} ${
                    variant === "prompt"
                        ? styles.promptModal
                        : fullscreenOnMobile
                            ? styles.fullscreenOnMobile
                            : ""
                }`}
                // style={{ zIndex: zIndex + 1 }}
            >
                {/* Header (optional for prompts) */}
                {title && (
                    <div className={styles.header}>
                        <h3>{title}</h3>
                        {variant !== "prompt" && (
                            <button className={styles.closeButton} onClick={onClose}>
                                <IoClose size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className={styles.body}>{children}</div>

                {/* Footer */}
                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    );
};

export default Modal;
