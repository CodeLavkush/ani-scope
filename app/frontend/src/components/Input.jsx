import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false,
    placeholder = "",
    disabled = false,
    error = "",
    wrapperClass = "",
    inputClass = "",
    labelClass = "",
}) {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className={`w-full flex flex-col gap-1 relative ${wrapperClass}`}>

            {/* Label */}
            {label && (
                <label
                    htmlFor={name}
                    className={`font-bold font-outfit uppercase ${labelClass}`}
                >
                    {label}
                </label>
            )}

            {/* Input */}
            <input
                id={name}
                name={name}
                type={inputType}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                disabled={disabled}
                className={`
          border-4 border-accent 
          h-14 w-full rounded-md 
          shadow-[4px_4px_0px_0px_#4E361E]
          outline-none p-2 pr-12
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? "border-red-500" : ""}
          ${inputClass}
        `}
            />

            {/* Password Toggle */}
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-10.5 flex items-center justify-center"
                    aria-label="Toggle password visibility"
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            )}

            {/* Error Message */}
            {error && (
                <span className="text-red-500 text-sm font-poppins">
                    {error}
                </span>
            )}
        </div>
    );
}

export default Input;