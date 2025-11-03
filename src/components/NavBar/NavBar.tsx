"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import styles from "./NavBar.module.css";
import AuthModal from '../AuthModal/AuthModal';

export default function NavBar() {
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<"login" | "register">("login");

    return (
        <header>
            <div className={styles.header}>
                <div className='brand'>GoblinMasters</div>
                <nav className={styles.nav + " flex gap-6 items-center"}>
                    <div className={"flex gap-4 "}>
                        <Link href="/">Inicio</Link>
                        <Link href="/iniciativa">Gestor de Iniciativa</Link>
                        <Link href="/personajes">Mis Personajes</Link>
                        <Link href="/bestias">Bestiarios</Link>
                    </div>
                    <div className={"flex gap-4 "}>
                        <button className='btn btn-primary ' onClick={() => { setModalMode("login"); setShowModal(true); }}>Iniciar sesión</button>
                        <button className='btn btn-primary ' onClick={() => { setModalMode("register"); setShowModal(true); }}>Registrarse</button>
                    </div>
                </nav>
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