"use client"
import React, { useState } from 'react';


type Props = {
    mode?: "login" | "register";
    onClose: () => void;
};

export default function AuthModal({ mode = "login", onClose }: Props) {
    const [tab, setTab] = useState<"login" | "register">(mode);

    return (
        <div className='modal-overlay'>
            <div className="modal">
                <div className="modal-tabs justify-center mb-4">
                    <h2>¡Bienvenido!</h2>
                </div>
                <div className="modal-actions">
                    <button className='modal-close' onClick={onClose}>X</button>
                </div>
                {
                    tab === "login" && (
                        <form action="" className="modal-form">
                            <div className="modal-tabs flex-col">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" className="modal-input" placeholder="tucorreo@ejemplo.com" />
                            </div>
                            <div className="modal-tabs flex-col">
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" className="modal-input" placeholder="********" />
                            </div>
                            <div className="modal-tabs">
                                <label>No tienes una cuenta? </label>
                                <button className='btn btn-link' onClick={() => setTab("register")}>Regístrate</button>
                            </div>
                        </form>
                    )
                }
                {
                    tab === "register" && (
                        <form action="" className="modal-form">
                            <div>
                                <label htmlFor="name">Nombre</label>
                                <input type="text" id="name" name="name" className="modal-input" placeholder="ejemplo23" />
                            </div>
                            <div>
                                <label htmlFor="email">Correo</label>
                                <input type="email" id="email" name="email" className="modal-input" placeholder="tucorreo@ejemplo.com" />
                            </div>
                            <div>
                                <label htmlFor="password">Contraseña</label>
                                <input type="password" id="password" name="password" className="modal-input" placeholder="********" />
                            </div>
                            <div>
                                <label htmlFor="confirm-password">Confirmar Contraseña</label>
                                <input type="password" id="confirm-password" name="confirm-password" className="modal-input" placeholder="********" />
                            </div>
                            <div className="modal-tabs">
                                <label>¿Ya tienes una cuenta? </label>
                                <button className='btn btn-link' onClick={() => setTab("login")}>Inicia sesión</button>
                            </div>
                        </form>
                    )
                }
                <div className="modal-actions justify-center">
                    <button type="submit" className="btn btn-primary">
                        {tab === "login" ? "Iniciar sesión" : "Registrarse"}
                    </button>
                </div>
            </div>
        </div>
    );
}