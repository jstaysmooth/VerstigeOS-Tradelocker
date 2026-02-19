"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, DollarSign, Briefcase, TrendingUp, Bell, Settings, User, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import './DashboardLauncher.css';

const BASE_LINKS = [
    { path: '/dashboard', icon: <Home size={20} />, label: 'Home' },
    { path: '/dashboard/trading', icon: <DollarSign size={20} />, label: 'Trading' },
    { path: '/dashboard/business', icon: <Briefcase size={20} />, label: 'Business' },
    { path: '/dashboard/sales', icon: <TrendingUp size={20} />, label: 'Sales' },
    { path: '/dashboard/profile', icon: <User size={20} />, label: 'Profile' },
];

const ADMIN_LINK = { path: '/dashboard/admin', icon: <Shield size={20} />, label: 'Admin' };

const DashboardLauncher: React.FC = () => {
    const pathname = usePathname();
    const [hoveredPath, setHoveredPath] = React.useState<string | null>(null);
    const { isAdmin } = useUser();
    const sidebarLinks = isAdmin ? [...BASE_LINKS, ADMIN_LINK] : BASE_LINKS;

    return (
        <div className="os-launcher glass-panel animate-slide-up">
            <div className="launcher-nav">
                {sidebarLinks.map(link => {
                    const isActive = pathname === link.path;
                    const isHovered = hoveredPath === link.path;

                    return (
                        <Link
                            key={link.path}
                            href={link.path}
                            className={`launcher-item ${isActive ? 'active' : ''}`}
                            onMouseEnter={() => setHoveredPath(link.path)}
                            onMouseLeave={() => setHoveredPath(null)}
                        >
                            <motion.div
                                className="launcher-content"
                                layout
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                <motion.div
                                    className="icon-wrapper"
                                    animate={{ scale: isHovered ? 1.1 : 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    {link.icon}
                                </motion.div>
                                <motion.div
                                    className="launcher-label-container"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{
                                        width: (isActive || isHovered) ? "auto" : 0,
                                        opacity: (isActive || isHovered) ? 1 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    <span className="launcher-label">{link.label}</span>
                                </motion.div>
                            </motion.div>

                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="active-bg"
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
            <div className="launcher-divider" />
            <div className="launcher-actions">
                <button className="launcher-item" title="Notifications">
                    <Bell size={20} />
                </button>
                <Link href="/dashboard/settings" title="Settings">
                    <button className="launcher-item" title="Settings">
                        <Settings size={20} />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default DashboardLauncher;
