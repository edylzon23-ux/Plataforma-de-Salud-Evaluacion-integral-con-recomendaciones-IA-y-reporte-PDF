// ===== VISTA DE AUTENTICACIÓN =====

class AuthView {
    
    static showLogin() {
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
    }
    
    static showRegister() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('register-form').classList.remove('hidden');
        this.resetRegisterSteps();
    }
    
    static resetRegisterSteps() {
        // Resetear a paso 1
        document.getElementById('reg-step-1').classList.remove('hidden');
        document.getElementById('reg-step-2').classList.add('hidden');
        document.getElementById('reg-step-3').classList.add('hidden');
        
        document.querySelectorAll('.step').forEach((s, idx) => {
            if (idx === 0) s.classList.add('active');
            else s.classList.remove('active');
        });
        
        window.regStep = 1;
    }
    
    static showRegisterStep(step) {
        document.getElementById(`reg-step-${window.regStep}`).classList.add('hidden');
        document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
        window.regStep = step;
        document.getElementById(`reg-step-${step}`).classList.remove('hidden');
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');
    }
    
    static showLoginError(message) {
        const errEl = document.getElementById('login-error');
        if (errEl) {
            errEl.textContent = message;
            errEl.classList.remove('hidden');
            setTimeout(() => errEl.classList.add('hidden'), 3000);
        }
    }
    
    static showRegisterError(message) {
        const errEl = document.getElementById('register-error');
        if (errEl) {
            errEl.textContent = message;
            errEl.classList.remove('hidden');
            setTimeout(() => errEl.classList.add('hidden'), 3000);
        }
    }
    
    static clearRegisterForm() {
        const fields = ['reg-email', 'reg-password', 'reg-password-confirm', 'reg-nombres', 'reg-apellidos',
                        'reg-carnet', 'reg-telefono', 'reg-direccion', 'reg-ciudad', 'reg-codigo-uni', 'reg-carrera'];
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        const selectFields = ['reg-sexo', 'reg-semestre', 'reg-facultad'];
        selectFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        document.getElementById('reg-fecha-nac').value = '';
    }
    
    static getRegisterData() {
        return {
            email: document.getElementById('reg-email').value.trim(),
            password: document.getElementById('reg-password').value,
            passwordConfirm: document.getElementById('reg-password-confirm').value,
            nombres: document.getElementById('reg-nombres').value.trim(),
            apellidos: document.getElementById('reg-apellidos').value.trim(),
            carnet: document.getElementById('reg-carnet').value.trim(),
            fechaNac: document.getElementById('reg-fecha-nac').value || null,
            sexo: document.getElementById('reg-sexo').value || null,
            telefono: document.getElementById('reg-telefono').value.trim() || null,
            direccion: document.getElementById('reg-direccion').value.trim() || null,
            ciudad: document.getElementById('reg-ciudad').value.trim() || null,
            codigoUni: document.getElementById('reg-codigo-uni').value.trim() || null,
            semestre: document.getElementById('reg-semestre').value || null,
            carrera: document.getElementById('reg-carrera').value.trim() || null,
            facultad: document.getElementById('reg-facultad').value || null
        };
    }
    
    static getLoginData() {
        return {
            email: document.getElementById('login-email').value.trim(),
            password: document.getElementById('login-password').value
        };
    }
    
    static validateRegisterStep1(data) {
        return data.nombres && data.apellidos && data.carnet && data.fechaNac && data.sexo;
    }
    
    static validateRegisterStep3(data) {
        if (!data.email || !data.password) return { valid: false, error: 'Email y contraseña son obligatorios' };
        if (data.password !== data.passwordConfirm) return { valid: false, error: 'Las contraseñas no coinciden' };
        if (data.password.length < 6) return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        return { valid: true };
    }
}

window.AuthView = AuthView;
window.regStep = 1;