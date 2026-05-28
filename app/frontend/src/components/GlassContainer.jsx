import React from "react";

export default function GlassContainer({
    children,
    width = "max-w-md",
    height = "",
    blur = "backdrop-blur-md",
    border = "border-white/30",
    bg = "bg-white/10",
    padding = "p-4",
    className = "",
}) {
    return (
        <div className={`${width} ${height}`}>
            <div
                className={`
                    rounded-2xl
                    border ${border}
                    ${bg}
                    ${blur}
                    ${padding}
                    space-y-3
                    text-white
                    ${className}
                `}
            >
                {children}
            </div>
        </div>
    );
}