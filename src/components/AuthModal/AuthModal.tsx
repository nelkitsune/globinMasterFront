"use client"
import React, { useState } from 'react';
import { validateLoginForm, validateRegisterForm } from '@/lib/validation';


type Props = {
    mode?: "login" | "register";
    onClose: () => void;
};

export default function AuthModal({ mode = "login", onClose }: Props) {
    const [tab, setTab] = useState<"login" | "register">(mode);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e: React.FormEvent) => {
        console.log("webas")
        e.preventDefault();
        const validation =
            tab === "login" ? validateLoginForm({ email: formData.email, password: formData.password })
                : validateRegisterForm({ username: formData.username, email: formData.email, password: formData.password, confirmPassword: formData.confirmPassword });
        const errs: Record<string, string> = {};
        Object.entries(validation).forEach(([k, v]) => {
            if (v) errs[k] = v;
        });

        setErrors(errs);

        if (Object.keys(errs).length === 0) {
            console.log("form válido", tab, formData);
            onClose();
        }
    };




    return (
        <div className='modal-overlay'>
            <div className="modal">
                <div className="modal-tabs justify-center mb-4">
                    <h2>¡Bienvenido!</h2>
                </div>
                <div className="modal-actions">
                    <button className='modal-close' onClick={onClose}>X</button>
                </div>
                <form action="" className="modal-form" onSubmit={handleSubmit}>
                    {
                        tab === "login" && (
                            <>
                                <div className="modal-tabs flex-col">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" name="email" className="modal-input" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={handleChange} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div className="modal-tabs flex-col">
                                    <label htmlFor="password">Contraseña</label>
                                    <input type="password" id="password" name="password" className="modal-input" placeholder="********" value={formData.password} onChange={handleChange} />
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>
                            </>
                        )
                    }
                    {
                        tab === "register" && (
                            <>
                                <div>
                                    <label htmlFor="name">Nombre</label>
                                    <input type="text" id="name" name="name" className="modal-input" placeholder="ejemplo23" value={formData.username} onChange={handleChange} />
                                    {errors.username && <span className="error-message">{errors.username}</span>}
                                </div>
                                <div>
                                    <label htmlFor="email">Correo</label>
                                    <input type="email" id="email" name="email" className="modal-input" placeholder="tucorreo@ejemplo.com" value={formData.email} onChange={handleChange} />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>
                                <div>
                                    <label htmlFor="password">Contraseña</label>
                                    <input type="password" id="password" name="password" className="modal-input" placeholder="********" value={formData.password} onChange={handleChange} />
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>
                                <div>
                                    <label htmlFor="confirm-password">Confirmar Contraseña</label>
                                    <input type="password" id="confirm-password" name="confirm-password" className="modal-input" placeholder="********" value={formData.confirmPassword} onChange={handleChange} />
                                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                </div>
                            </>

                        )
                    }
                    <div className="modal-actions">
                        <button type="button" className="btn" onClick={() => setTab(tab === "login" ? "register" : "login")}>
                            {tab === "login" ? "Crear cuenta" : "Ya tengo cuenta"}
                        </button>
                        <button type="submit" className="btn btn-primary">{tab === "login" ? "Entrar" : "Registrarse"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
