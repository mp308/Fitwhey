import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoFMD from "../assets/images/FMD.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaShoppingCart, FaFacebook, FaInstagram, FaLine, FaTwitter } from "react-icons/fa";
import { GrClose } from "react-icons/gr"; // Import ไอคอน X
import { useUserAuth } from "../gobal/UserAuthContext"; // Import useUserAuth

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logOut } = useUserAuth(); // Get logOut and user from context
    const navigate = useNavigate(); // For navigation after logout

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // Toggle the mobile menu
    };

    const handleLogout = async () => {
        await logOut(); // Call logOut function
        navigate("/"); // Redirect to login page after logout
    };

    return (
        <>
            {/* Red top bar */}
            <div className="bg-red-600 w-full h-2"></div>

            <nav className="bg-white text-red-600 relative">
                <div className="w-full flex justify-between items-center">
                    {/* Logo with parallelogram background */}
                    <Link to="/" className="relative flex items-center">
                        <div
                            className="bg-red-600 flex justify-center items-center w-[250px] h-[100px] ml-24"
                            style={{ clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)' }}>
                            <img className="h-16 w-auto" src={logoFMD} alt="Logo" />
                        </div>
                        <span className="ml-4 font-bebas text-xl">FITMAX PERFORMANCE</span>
                    </Link>

                    {/* Desktop menu */}
                    <div className="hidden xl:flex space-x-6 text-xl items-center ml-auto mr-24 font-prompt">
                        {/* Show social media links only for non-admin */}
                        {user && user.role !== "Admin" && (
                            <div className="flex space-x-1">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                    <FaFacebook />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                    <FaInstagram />
                                </a>
                                <a href="https://line.me" target="_blank" rel="noopener noreferrer" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                    <FaLine />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                    <FaTwitter />
                                </a>
                            </div>
                        )}

                        {!user ? (
                            <>
                                <Link to="/register" className="hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">สมัครสมาชิก</Link>
                                <Link to="/login" className="hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">เข้าสู่ระบบ</Link>
                            </>
                        ) : (
                            <>
                                {/* Admin view */}
                                {user.role === "Admin" ? (
                                    <>
                                        <Link to="/admin" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">Admin</Link>
                                        <button
                                            onClick={handleLogout}
                                            className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                            ออกจากระบบ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">หน้าแรก</Link>
                                        <Link to="/Status" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">สถานะ</Link>
                                        <Link to="/profile" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">โปรไฟล์</Link>
                                        <Link to="/products" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">โปรดัก</Link>
                                        <Link to="/Shopping" className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                            <FaShoppingCart />
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="hover:scale-105 hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                            ออกจากระบบ
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="xl:hidden text-3xl">
                        {isMenuOpen ? (
                            <GrClose
                                id="menu-close"
                                className=" transition delay-50 duration-300 ease-in-out"
                                onClick={toggleMenu}
                            />
                        ) : (
                            <GiHamburgerMenu
                                id="menu-toggle"
                                className=" transition delay-50 duration-300 ease-in-out"
                                onClick={toggleMenu}
                            />
                        )}
                    </div>
                </div>

                {/* Mobile dropdown menu with transition */}
                <div className={`xl:hidden bg-white text-red-600 absolute w-full top-full left-0 z-50 transition-all duration-500 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col space-y-4 p-4">
                        {!user ? (
                            <>
                                <Link to="/register" onClick={toggleMenu} className="text-center hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">สมัครสมาชิก</Link>
                                <Link to="/login" onClick={toggleMenu} className="text-center hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">เข้าสู่ระบบ</Link>
                            </>
                        ) : (
                            <>
                                {user.role === "Admin" ? (
                                    <>
                                        <Link to="/admin" onClick={toggleMenu} className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">Admin</Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMenu();
                                            }}
                                            className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                            ออกจากระบบ
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/" onClick={toggleMenu} className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">หน้าแรก</Link>
                                        <Link to="/Status" onClick={toggleMenu} className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">สถานะ</Link>
                                        <Link to="/profile" onClick={toggleMenu} className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">โปรไฟล์</Link>
                                        <Link to="/products" onClick={toggleMenu} className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">โปรดัก</Link>
                                        <Link to="/Shopping" onClick={toggleMenu} className="flex justify-center items-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300" >
                                            <FaShoppingCart />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                toggleMenu();
                                            }}
                                            className="text-center font-prompt hover:bg-red-600 hover:text-white py-2 px-4 rounded transition duration-300">
                                            ออกจากระบบ
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Header;
