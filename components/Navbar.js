import { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPinterest, FaLinkedinIn, FaChartBar, FaHome, FaCube, FaTags, FaMoneyBillAlt, FaEllipsisH, FaInfoCircle } from 'react-icons/fa';

const AvatarMenu = () => {
    const [state, setState] = useState(false);
    const profileRef = useRef();

    const navigation = [
        { title: "Dashboard", path: "javascript:void(0)" },
        { title: "Analytics", path: "javascript:void(0)" },
        { title: "Profile", path: "javascript:void(0)" },
        { title: "Settings", path: "javascript:void(0)" },
    ];

    useEffect(() => {
        const handleDropDown = (e) => {
            if (!profileRef.current.contains(e.target)) setState(false);
        };
        document.addEventListener('click', handleDropDown);
        return () => {
            document.removeEventListener('click', handleDropDown);
        };
    }, []);

    return (
        <div className="relative border-t lg:border-none">
            <div className="">
                <button
                    ref={profileRef}
                    className="hidden w-10 h-10 outline-none rounded-full ring-offset-2 ring-gray-200 lg:focus:ring-2 lg:block"
                    onClick={() => setState(!state)}
                >
                    <img
                        src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg"
                        className="w-full h-full rounded-full"
                        alt="Profile"
                    />
                </button>
            </div>
            <ul className={`bg-white top-14 right-0 mt-6 space-y-6 lg:absolute lg:border lg:rounded-md lg:w-52 lg:shadow-md lg:space-y-0 lg:mt-0 ${state ? '' : 'lg:hidden'}`}>
                {navigation.map((item, idx) => (
                    <li key={idx}>
                        <a className="block text-gray-600 hover:text-gray-900 lg:hover:bg-gray-50 lg:p-3" href={item.path}>
                            {item.title}
                        </a>
                    </li>
                ))}
                <button className="block w-full text-justify text-gray-600 hover:text-gray-900 border-t py-3 lg:hover:bg-gray-50 lg:p-3">
                    Logout
                </button>
            </ul>
        </div>
    );
};

const SubmenuNavItem = ({ title, Icon }) => (
    <li className="py-1 border-b-2 border-transparent">
        <a href="javascript:void(0)" className="flex items-center justify-start uppercase py-2 px-3 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 duration-150">
            <Icon className="mr-2" />
            {title}
        </a>
    </li>
);

export default () => {
    const [state, setState] = useState(false);
    const navigation = [
        { title: "3344 mods", path: "javascript:void(0)" },
        { title: "8716 orders", path: "javascript:void(0)" },
        { title: "login/register", path: "javascript:void(0)" },
    ];
    
    const submenuNav = [
        { title: "Membership", Icon: FaChartBar },
        { title: "Home", Icon: FaHome },
        { title: "All Mods", Icon: FaCube },
        { title: "Bundle", Icon: FaTags },
        { title: "Paid Mod", Icon: FaMoneyBillAlt },
        { title: "Miscellaneous", Icon: FaEllipsisH },
        { title: "About Us", Icon: FaInfoCircle },
    ];

    return (
        <div>
            <div className="hidden lg:block px">
                <section className="py-1 bg-gray-500 px-10 flex justify-between">
                    <div className="flex flex-row">
                        <a href="#"><FaFacebookF className="mx-2 text-white" /></a>
                        <a href="#"><FaTwitter className="mx-2 text-white" /></a>
                        <a href="#"><FaInstagram className="mx-2 text-white" /></a>
                        <a href="#"><FaEnvelope className="mx-2 text-white" /></a>
                        <a href="#"><FaPinterest className="mx-2 text-white" /></a>
                        <a href="#"><FaLinkedinIn className="mx-2 text-white" /></a>
                    </div>
                    <div>
                        <p className="text-white text-xs">Server maintenance is performed every Wednesday 05:00 - 06:00 (UTC)
                            Website backup is performed every day from 23:00 - 23:30 (UTC)
                            Credits are renewed every day at 8:00 (UTC)</p>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-[#007bff] text-white rounded uppercase hover:bg-[#0056b3]">Download Everything for free! become co-owner of our team</button>
                    </div>
                </section>
            </div>
            <header className="text-base lg:text-sm">
                <div className={`bg-white items-center gap-x-14 px-4 max-w-screen-xl mx-auto lg:flex lg:px-8 lg:static ${state ? "h-full fixed inset-x-0" : ""}`}>
                    <div className="flex items-center justify-between py-3 lg:py-5 lg:block">
                        <a href="javascript:void(0)">
                           <h1 className="text-sm font-bold " >logo</h1>
                        </a>
                        <div className="lg:hidden">
                            <button className="text-gray-500 hover:text-gray-800" onClick={() => setState(!state)}>
                                {state ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                        <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm8.25 5.25a.75.75 0 01.75-.75h8.25a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className={`nav-menu flex-1 pb-28 mt-8 overflow-y-auto max-h-screen lg:block lg:overflow-visible lg:pb-0 lg:mt-0 ${state ? "" : "hidden"}`}>
                        <ul className="items-center space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
                            <form onSubmit={(e) => e.preventDefault()} className='flex-1 items-center justify-start pb-4 lg:flex lg:pb-0'>
                                <div className="flex items-center gap-1 px-2 border rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Enter name of mod you want here"
                                        className="w-full px-2 py-2 text-gray-500 bg-transparent rounded-md outline-none"
                                    />
                                </div>
                            </form>
                            {navigation.map((item, idx) => (
                                <li key={idx}>
                                    <a href={item.path} className="block text-black hover:text-black py-2 px-4 rounded-md bg-gray-200 hover:bg-white">
                                        {item.title}
                                    </a>
                                </li>
                            ))}
                            {/* <AvatarMenu /> */}
                        </ul>
                    </div>
                </div>
                <nav className="border-b">
                    <ul className="flex items-center gap-x-3 max-w-screen-xl mx-auto px-4 overflow-x-auto lg:px-8">
                        {submenuNav.map((item, idx) => (
                            <SubmenuNavItem key={idx} title={item.title} Icon={item.Icon} />
                        ))}
                    </ul>
                </nav>
            </header>
        </div>
    );
};
