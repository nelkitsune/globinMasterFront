export const isNotEmpty = (v: string) => v.trim().length > 0;

export const minLength = (v: string, min: number) => v.trim().length >= min;

export const isEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export type FieldRule = {
    check: (v: string) => boolean;
    message: string;
};
export function runRules(value: string, rules: FieldRule[]) {
    for (const r of rules) {
        if (!r.check(value)) return r.message;
    }
    return "";
}

export function validateLoginForm(payload: { email: string; password: string }) {
    return {
        email: runRules(payload.email, [
            { check: isNotEmpty, message: "Email requerido" },
            { check: isEmail, message: "Email inválido" },
        ]),
        password: runRules(payload.password, [
            { check: isNotEmpty, message: "Contraseña requerida" },
            { check: (v) => minLength(v, 6), message: "Mínimo 6 caracteres" },
        ]),
    };
}

export function validateRegisterForm(payload: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}) {
    return {
        username: runRules(payload.username, [
            { check: isNotEmpty, message: "Usuario requerido" },
            { check: (v) => minLength(v, 3), message: "Mínimo 3 caracteres" },
        ]),
        ...validateLoginForm({ email: payload.email, password: payload.password }),
        confirmPassword: runRules(payload.confirmPassword, [
            { check: isNotEmpty, message: "Confirmación requerida" },
            { check: (v) => v === payload.password, message: "No coincide con la contraseña" },
        ]),
    };
}