import React from "react"

function Loader({ size = 40, color = "border-blue-500" }) {

    return (
        <div className="flex justify-center items-center">
            <div
                className={`w-full h-full animate-spin rounded-full border-4 border-t-transparent ${color}`}
                style={{ width: size, height: size }}
            />
        </div>
    );
}

export default Loader;