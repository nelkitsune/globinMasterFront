"use cliente"

import React from 'react';
import Link from 'next/link';
import styles from "./NavBar.module.css";

export default function NavBar() {
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
                        <button className='btn btn-primary '>Iniciar sesión</button>
                        <button className='btn btn-primary '>Registrarse</button>
                    </div>
                </nav>
            </div>
        </header>
    );
}