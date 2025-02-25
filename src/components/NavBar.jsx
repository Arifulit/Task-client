import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const NavBar = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // For mobile menu toggle
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    const handleToggle = (e) => {
        const newTheme = e.target.checked ? "dark" : "light";
        setTheme(newTheme);
    };

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const handleLogout = () => {
        logOut()
            .then(() => navigate("/login"))
            .catch((error) => console.error("Logout failed:", error));
    };

    return (
        <nav className="bg-gray-500 text-white py-4 px-6 flex items-center justify-between fixed top-0 left-0 w-full shadow-md z-50 backdrop-blur-3xl bg-gray-500/70">
            {/* Left: Hamburger Menu and Logo */}
            <div className="flex items-center space-x-4">
                {/* Hamburger Menu Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="block md:hidden text-white focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                {/* Logo */}
                <Link to="/" className="text-xl font-bold flex items-center space-x-2">
                    <img src="https://i.ibb.co/TMsXLg6p/task.png" alt="Website Logo" className="h-8 w-8" />
                    <span className="text-white font-bold text-xl">Task</span>
                </Link>
            </div>

            {/* Right: User Profile and Logout */}
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
                {/* Dark/Light Mode Toggle */}
                <label className="swap swap-rotate">
                    <input type="checkbox" onChange={handleToggle} checked={theme === "dark"} />
                    <svg
                        className="swap-on h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                    <svg
                        className="swap-off h-10 w-10 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                    >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                </label>

                {user ? (
                    <>
                        {/* Profile Section */}
                        <div className="relative group cursor-pointer">
                            <img
                                src={user.photoURL || "/default-avatar.png"}
                                alt="User Profile"
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="absolute right-1 hidden group-hover:block bg-orange-500 text-black p-2 rounded shadow-md z-10">
                                <p className="font-bold">{user.displayName}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
                        >
                            LogOut
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive ? "bg-yellow-600 text-white px-4 py-2 rounded" : "bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/register"
                            className={({ isActive }) =>
                                isActive ? "bg-yellow-600 text-white px-4 py-2 rounded" : "bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400"
                            }
                        >
                            Register
                        </NavLink>
                    </>
                )}
            </div>

            {/* Mobile Menu (Sidebar) */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-start">
                    <div className="bg-blue-600 text-white w-64 p-6 space-y-6 flex flex-col">
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="text-white text-2xl mb-4"
                        >
                            &times; {/* Close the menu */}
                        </button>
                        <NavLink
                            to="/home"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-white py-2"
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/about"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-white py-2"
                        >
                            About
                        </NavLink>
                        <NavLink
                            to="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-white py-2"
                        >
                            Services
                        </NavLink>
                        <NavLink
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-white py-2"
                        >
                            Contact
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
