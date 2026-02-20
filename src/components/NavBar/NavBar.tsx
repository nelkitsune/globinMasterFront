"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from "./NavBar.module.css";
import { useAuthStore } from '@/store/useAuthStore';

export default function NavBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isAuthenticated, user, logout } = useAuthStore();
    const router = useRouter();
    const normalizedRole = String(user?.role || '').trim().toUpperCase();
    const isAdmin = normalizedRole === 'ADMIN';

    useEffect(() => {
        console.log('[NAVBAR] auth state', {
            isAuthenticated,
            username: user?.username,
            roleRaw: user?.role,
            roleNormalized: normalizedRole,
            showAdminLink: isAuthenticated && isAdmin,
        });
    }, [isAuthenticated, user?.username, user?.role, normalizedRole, isAdmin]);

    const handleLogout = () => {
        logout();
        setIsMobileMenuOpen(false);
        router.push('/login');
    };

    return (
        <header>
            <div className={styles.header}>
                <div className={styles.inner}>
                    <div className='brand'>GoblinMasters</div>

                    {/* Botón hamburguesa para móvil */}
                    <button
                        className={styles.hamburger}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={styles.hamburgerLine}></span>
                        <span className={styles.hamburgerLine}></span>
                        <span className={styles.hamburgerLine}></span>
                    </button>

                    {/* Navegación principal */}
                    <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ''}`}>
                        <div className={styles.navLinks}>
                            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Inicio</Link>
                            <Link href="/gestorDeIniciativa" onClick={() => setIsMobileMenuOpen(false)}>Gestor de Iniciativa</Link>
                            {isAuthenticated && (
                                <>
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                                    <Link href="/miPerfil" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>
                                    {isAdmin && (
                                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} style={{ color: "#f59e0b", fontWeight: "bold" }}>
                                            ⚙️ Admin
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        <div className={styles.authButtons}>
                            {isAuthenticated ? (
                                <>
                                    <span className="text-sm" style={{ color: 'white', opacity: 0.8 }}>
                                        {user?.username || user?.email}
                                    </span>
                                    <button
                                        className='btn btn-outline btn-sm'
                                        onClick={handleLogout}
                                    >
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className='btn btn-primary btn-sm'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Iniciar sesión
                                    </Link>
                                    <Link
                                        href="/register"
                                        className='btn btn-outline btn-sm'
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}