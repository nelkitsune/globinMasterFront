"use cliente"

import React from 'react';
import Link from 'next/link';
import styles from "./NavBar.module.css";

export default function NavBar() {
    return (
    <header>
        <div className={styles.header}>
            <div className='brand'>GoblinMasters</div>
            <nav className={styles.nav}>
              <Link href="/">Inicio</Link>
              <Link href="/iniciativa">Gestor de Iniciativa</Link>
              <Link href="/personajes">Mis Personajes</Link>
              <Link href="/bestias">Bestiarios</Link>
            </nav>
        </div>
    </header>
    );

    }