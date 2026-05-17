import React from "react";

function Button({
    children,
    loading = false,
    LoaderComponent,
    type = "button",
    onClick,
    wrapperClass = "",
    buttonClass = "",
}) {
    return (
        <div className={`w-full flex justify-center ${wrapperClass}`}>
            <button
                type={type}
                onClick={onClick}
                disabled={loading}
                className={`bg-accent text-white font-bold font-poppins tracking-wider w-full h-14 rounded-md uppercase text-xl flex items-center justify-center ${buttonClass}`}
            >
                {loading && LoaderComponent ? LoaderComponent : children}
            </button>
        </div>
    );
}

export default Button;