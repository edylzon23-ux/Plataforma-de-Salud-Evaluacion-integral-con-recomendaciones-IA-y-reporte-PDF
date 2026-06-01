// ===== CONTROLADOR DE AUTENTICACIÓN =====

class AuthController {
    
    static async init() {
        // Verificar sesión existente
        const result = await AuthModel.getSession();
        if (result.success) {
            DashboardView.renderWelcome(
                result.user?.perfil?.nombres || 
                result.user?.user_metadata?.nombres || 
                result.user?.email?.split('@')[0] || 'Usuario'
            );
            AppController.showApp();
            AppController.showPage('dashboard');
            DashboardController.loadDashboard();
        } else {
            AppController.showAuth();
        }
        
        // Configurar event listeners
        this.setupEventListeners();
    }
    
    static setupEventListeners() {
        // Auth buttons
        const btnLogin = document.getElementById('btn-login');
        if (btnLogin) btnLogin.addEventListener('click', () => this.login());
        
        const btnRegister = document.getElementById('btn-register');
        if (btnRegister) btnRegister.addEventListener('click', () => this.register());
        
        const showRegister = document.getElementById('show-register');
        if (showRegister) showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            AuthView.showRegister();
        });
        
        const showLogin = document.getElementById('show-login');
        if (showLogin) showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            AuthView.showLogin();
        });
        
        // Register step buttons
        const nextStep1 = document.getElementById('next-step-1');
        if (nextStep1) nextStep1.addEventListener('click', () => this.nextRegStep(2));
        
        const nextStep2 = document.getElementById('next-step-2');
        if (nextStep2) nextStep2.addEventListener('click', () => this.nextRegStep(3));
        
        const prevStep2 = document.getElementById('prev-step-2');
        if (prevStep2) prevStep2.addEventListener('click', () => this.nextRegStep(1));
        
        const prevStep3 = document.getElementById('prev-step-3');
        if (prevStep3) prevStep3.addEventListener('click', () => this.nextRegStep(2));
        
        // Logout
        const btnLogout = document.getElementById('btn-logout');
        if (btnLogout) btnLogout.addEventListener('click', () => this.logout());
    }
    
    static async login() {
        const { email, password } = AuthView.getLoginData();
        
        if (!email || !password) {
            AuthView.showLoginError('Por favor completa todos los campos');
            return;
        }
        
        const result = await AuthModel.login(email, password);
        if (result.success) {
            DashboardView.renderWelcome(
                result.user?.perfil?.nombres || 
                result.user?.user_metadata?.nombres || 
                result.user?.email?.split('@')[0] || 'Usuario'
            );
            AppController.showApp();
            AppController.showPage('dashboard');
            DashboardController.loadDashboard();
            showToast('✅ Sesión iniciada correctamente');
        } else {
            AuthView.showLoginError(result.error || 'Error al iniciar sesión');
        }
    }
    
    static async register() {
        const data = AuthView.getRegisterData();
        
        // Validar paso 3
        const validation = AuthView.validateRegisterStep3(data);
        if (!validation.valid) {
            AuthView.showRegisterError(validation.error);
            return;
        }
        
        const result = await AuthModel.register(data);
        if (result.success) {
            AuthView.clearRegisterForm();
            AuthView.showLogin();
            showToast('✅ Cuenta creada exitosamente. Por favor inicia sesión.');
        } else {
            AuthView.showRegisterError(result.error || 'Error al registrarse');
        }
    }
    
    static async logout() {
        const result = await AuthModel.logout();
        if (result.success) {
            AppController.showAuth();
            AuthView.showLogin();
            showToast('Sesión cerrada');
        }
    }
    
    static nextRegStep(step) {
        if (step > window.regStep) {
            if (window.regStep === 1) {
                const data = AuthView.getRegisterData();
                if (!AuthView.validateRegisterStep1(data)) {
                    showToast('Completa todos los campos obligatorios');
                    return;
                }
            }
        }
        
        AuthView.showRegisterStep(step);
    }
}

window.AuthController = AuthController;