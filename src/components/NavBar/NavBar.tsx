"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import styles from "./NavBar.module.css";
import AuthModal from '../AuthModal/AuthModal';

export default function NavBar() {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"login" | "register">("login");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                            <Link href="/iniciativa" onClick={() => setIsMobileMenuOpen(false)}>Gestor de Iniciativa</Link>
                            <Link href="/personajes" onClick={() => setIsMobileMenuOpen(false)}>Mis Personajes</Link>
                        </div>

                        <div className={styles.authButtons}>
                            <button className='btn btn-primary btn-sm' onClick={() => { setModalMode("login"); setShowModal(true); setIsMobileMenuOpen(false); }}>
                                Iniciar sesión
                            </button>
                            <button className='btn btn-outline btn-sm' onClick={() => { setModalMode("register"); setShowModal(true); setIsMobileMenuOpen(false); }}>
                                Registrarse
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
            {showModal && (
                <AuthModal
                    mode={modalMode}
                    onClose={() => setShowModal(false)}
                />
            )}
        </header>
    );
}