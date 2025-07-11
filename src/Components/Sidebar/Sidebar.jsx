import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { menuData } = useAuth();

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                {/* <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                        <i className="bi bi-grid"></i>
                        <span>Dashboard</span>
                    </Link>
                </li> */}

                {menuData?.map((menu) => {
                    const menuMaster = menu.menuMaster;
                    if (!menuMaster.status) return null;
                    const menuName = menuMaster.menuName;
                    const icon = menuMaster.menuIcon || 'bi bi-folder';
                    const subMenus = menuMaster.subMenuMaster?.filter(sub => sub.status) || [];

                    if (subMenus.length === 0) {
                        return (
                            <li className="nav-item" key={menuMaster.id}>
                                <Link to={`/${menuMaster.route}`} className="nav-link">
                                    <i className={icon}></i>
                                    <span>{menuName}</span>
                                </Link>
                            </li>
                        );
                    }

                    const menuId = `menu-${menuMaster.id}`;
                    return (
                        <li className="nav-item" key={menuMaster.id}>
                            <a
                                className="nav-link collapsed"
                                data-bs-target={`#${menuId}`}
                                data-bs-toggle="collapse"
                                href="#"
                            >
                                <i className={icon}></i>
                                <span>{menuName}</span>
                                <i className="bi bi-chevron-down ms-auto"></i>
                            </a>
                            <ul
                                id={menuId}
                                className="nav-content collapse"
                                data-bs-parent="#sidebar-nav"
                            >
                                {subMenus.map((sub) => (
                                    <li key={sub.id}>
                                        <Link to={`/${sub.route}`}>
                                            <i className="bi bi-circle"></i>
                                            <span>{sub.subMenuName}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};

export default Sidebar;