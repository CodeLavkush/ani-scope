import React, { useState } from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import Menu from './Menu';

function ToggleMenu({ btnClass = "", iconClass = "text-white hover:text-gray-300" }) {
    const [toggleMenu, setToggleMenu] = useState(false);

    const handleToggleMenu = () => {
        setToggleMenu(prev => !prev);
    };

    return (
        <div className='z-40'>
            {/* Open Menu Button */}
            <button onClick={handleToggleMenu} className={`cursor-pointer ${btnClass}`} aria-label="Toggle Navigation Menu">
                <MenuIcon
                    className={iconClass}
                    size={36}
                />
            </button>

            {/* Menu Component */}
            <Menu isMenu={toggleMenu} setToggleMenu={setToggleMenu} />
        </div>
    );
}

export default ToggleMenu;