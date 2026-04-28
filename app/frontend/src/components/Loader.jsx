import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function Loader() {
    const container = useRef();

    useGSAP(() => {
        const dots = gsap.utils.toArray(".dot");

        gsap.to(dots, {
            y: -20,
            duration: 0.6,
            repeat: -1,
            yoyo: true,
            stagger: 0.1,
            ease: "power1.inOut"
        });

        gsap.to(".spinner", {
            rotate: 360,
            duration: 2,
            repeat: -1,
            ease: "linear"
        });

    }, { scope: container });

    return (
        <div
            ref={container}
            className="w-full h-full flex justify-center items-center bg-primary"
        >
            <div className="spinner flex gap-3">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="dot w-4 h-4 bg-accent rounded-full"
                    />
                ))}
            </div>
        </div>
    );
}

export default Loader;