// ==========================================
// app.js - CONTROLADOR PRINCIPAL COMPLETO
// ==========================================

// Variable global para el paso de registro
window.regStep = 1;

// Controlador principal de la aplicación
window.AppController = {
    currentUser: null,
    
    // Mostrar una página específica
    showPage: function(page) {
        console.log('Mostrando página:', page);
        
        // Ocultar todas las páginas
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        // Mostrar página seleccionada
        const pageEl = document.getElementById(`page-${page}`);
        if (pageEl) pageEl.classList.add('active');
        
        // Activar navegación
        const navEl = document.querySelector(`[data-page="${page}"]`);
        if (navEl) navEl.classList.add('active');
        
        // Actualizar título
        const titles = {
            dashboard: 'Dashboard',
            'nuevo-registro': 'Nuevo Registro',
            resultado: 'Resultado',
            historial: 'Mi Historial',
            antecedentes: 'Antecedentes Médicos',
            perfil: 'Mi Perfil',
            admin: 'Administración'
        };
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.textContent = titles[page] || page;
        
        // Cargar datos según página
        setTimeout(() => {
            if (page === 'dashboard' && window.DashboardController) {
                window.DashboardController.loadDashboard();
            } else if (page === 'historial' && window.HealthController) {
                window.HealthController.loadHistorial();
            } else if (page === 'perfil' && window.UserController) {
                window.UserController.loadPerfil();
            } else if (page === 'antecedentes' && window.UserController) {
                window.UserController.loadAntecedentes();
            } else if (page === 'admin' && window.AdminController) {
                window.AdminController.loadAdmin();
            }
        }, 50);
    },
    
    // Mostrar pantalla de la app (sidebar + contenido)
    showApp: function() {
        const authScreen = document.getElementById('auth-screen');
        const appScreen = document.getElementById('app-screen');
        if (authScreen) authScreen.classList.add('hidden');
        if (appScreen) appScreen.classList.remove('hidden');
        
        // Mostrar admin link si es admin o médico
        const rol = window.AppState?.currentUser?.perfil?.rol;
        const adminLink = document.getElementById('admin-link');
        const adminDivider = document.getElementById('admin-divider');
        
        if (adminLink && adminDivider && (rol === 'admin' || rol === 'medico')) {
            adminLink.style.display = 'flex';
            adminDivider.style.display = 'block';
        }
    },
    
    // Mostrar pantalla de autenticación (login/register)
    showAuth: function() {
        const authScreen = document.getElementById('auth-screen');
        const appScreen = document.getElementById('app-screen');
        if (authScreen) authScreen.classList.remove('hidden');
        if (appScreen) appScreen.classList.add('hidden');
    },
    
    // Alternar sidebar en móvil
    toggleSidebar: function() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.toggle('open');
    }
};

// ===== INICIALIZACIÓN DE LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Inicializando aplicación...');
    
    // Verificar si hay una sesión activa
    if (window.AuthModel) {
        const result = await window.AuthModel.getSession();
        
        if (result && result.success) {
            // Usuario logueado - mostrar app
            const nombre = result.user?.perfil?.nombres || 
                           result.user?.user_metadata?.nombres || 
                           result.user?.email?.split('@')[0] || 'Usuario';
            
            if (window.DashboardView) {
                window.DashboardView.renderWelcome(nombre);
            }
            
            window.AppController.showApp();
            window.AppController.showPage('dashboard');
            
            if (window.DashboardController) {
                window.DashboardController.loadDashboard();
            }
        } else {
            // Usuario no logueado - mostrar login
            window.AppController.showAuth();
            if (window.AuthView) {
                window.AuthView.showLogin();
            }
        }
    } else {
        console.error('❌ AuthModel no está cargado');
        window.AppController.showAuth();
    }
    
    // ===== CONFIGURAR EVENT LISTENERS =====
    
    // Navegación del sidebar
    document.querySelectorAll('.nav-item').forEach(nav => {
        nav.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) window.AppController.showPage(page);
        });
    });
    
    // Botón de menú para móvil
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            window.AppController.toggleSidebar();
        });
    }
    
    // Botones de autenticación
    const btnLogin = document.getElementById('btn-login');
    if (btnLogin && window.AuthController) {
        btnLogin.onclick = function() { window.AuthController.login(); };
    }
    
    const btnRegister = document.getElementById('btn-register');
    if (btnRegister && window.AuthController) {
        btnRegister.onclick = function() { window.AuthController.register(); };
    }
    
    const showRegisterLink = document.getElementById('show-register');
    if (showRegisterLink && window.AuthView) {
        showRegisterLink.onclick = function(e) {
            e.preventDefault();
            window.AuthView.showRegister();
        };
    }
    
    const showLoginLink = document.getElementById('show-login');
    if (showLoginLink && window.AuthView) {
        showLoginLink.onclick = function(e) {
            e.preventDefault();
            window.AuthView.showLogin();
        };
    }
    
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout && window.AuthController) {
        btnLogout.onclick = function() { window.AuthController.logout(); };
    }
    
    // Pasos de registro
    const nextStep1 = document.getElementById('next-step-1');
    if (nextStep1 && window.AuthController) {
        nextStep1.onclick = function() { window.AuthController.nextRegStep(2); };
    }
    
    const nextStep2 = document.getElementById('next-step-2');
    if (nextStep2 && window.AuthController) {
        nextStep2.onclick = function() { window.AuthController.nextRegStep(3); };
    }
    
    const prevStep2 = document.getElementById('prev-step-2');
    if (prevStep2 && window.AuthController) {
        prevStep2.onclick = function() { window.AuthController.nextRegStep(1); };
    }
    
    const prevStep3 = document.getElementById('prev-step-3');
    if (prevStep3 && window.AuthController) {
        prevStep3.onclick = function() { window.AuthController.nextRegStep(2); };
    }
    
    // Botón de envío de registro
    const btnSubmitRegistro = document.getElementById('btn-submit-registro');
    if (btnSubmitRegistro && window.HealthController) {
        btnSubmitRegistro.onclick = function() { window.HealthController.enviarRegistro(); };
    }
    
    // Botón descargar PDF de análisis
    const btnDescargarPdf = document.getElementById('btn-descargar-pdf');
    if (btnDescargarPdf && window.HealthController) {
        btnDescargarPdf.onclick = function() { window.HealthController.descargarAnalisisPDF(); };
    }
    
    // Botón exportar historial
    const btnExportarHistorial = document.getElementById('btn-exportar-historial');
    if (btnExportarHistorial && window.HealthController) {
        btnExportarHistorial.onclick = function() { window.HealthController.exportarHistorialPDF(); };
    }
    
    // Botón exportar recomendaciones
    const btnExportarRecomendaciones = document.getElementById('btn-export-recomendaciones');
    if (btnExportarRecomendaciones && window.HealthController) {
        btnExportarRecomendaciones.onclick = function() { window.HealthController.exportarRecomendacionesPDF(); };
    }
    
    // Botón guardar antecedentes
    const btnGuardarAntecedentes = document.getElementById('btn-guardar-antecedentes');
    if (btnGuardarAntecedentes && window.UserController) {
        btnGuardarAntecedentes.onclick = function() { window.UserController.guardarAntecedentes(); };
    }
    
    // Botón guardar perfil
    const btnGuardarPerfil = document.getElementById('btn-guardar-perfil');
    if (btnGuardarPerfil && window.UserController) {
        btnGuardarPerfil.onclick = function() { window.UserController.guardarPerfil(); };
    }
    
    // Botón cambiar password
    const btnCambiarPassword = document.getElementById('btn-cambiar-password');
    if (btnCambiarPassword && window.UserController) {
        btnCambiarPassword.onclick = function() { window.UserController.cambiarPassword(); };
    }
    
    // Inputs de rango para el formulario de salud
    const alimentacion = document.getElementById('h-alimentacion');
    if (alimentacion) {
        alimentacion.oninput = function(e) { 
            const val = document.getElementById('alimentacion-val');
            if (val) val.textContent = e.target.value;
        };
    }
    
    const estres = document.getElementById('h-estres');
    if (estres) {
        estres.oninput = function(e) { 
            const val = document.getElementById('estres-val');
            if (val) val.textContent = e.target.value;
        };
    }
    
    const ansiedad = document.getElementById('h-ansiedad');
    if (ansiedad) {
        ansiedad.oninput = function(e) { 
            const val = document.getElementById('ansiedad-val');
            if (val) val.textContent = e.target.value;
        };
    }
    
    // Inputs para preview de IMC
    const peso = document.getElementById('h-peso');
    if (peso && window.HealthFormView) {
        peso.oninput = function() { window.HealthFormView.calcularIMCPreview(); };
    }
    
    const talla = document.getElementById('h-talla');
    if (talla && window.HealthFormView) {
        talla.oninput = function() { window.HealthFormView.calcularIMCPreview(); };
    }
    
    // Toggle de discapacidad en antecedentes
    const discapacidad = document.getElementById('ant-discapacidad');
    if (discapacidad && window.AntecedentesView) {
        discapacidad.onchange = function() { window.AntecedentesView.toggleDiscapacidad(); };
    }
    
    // Búsqueda en admin
    const searchInput = document.getElementById('admin-search');
    if (searchInput && window.AdminController) {
        let timeout;
        searchInput.oninput = function(e) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                window.AdminController.buscarUsuarios(e.target.value);
            }, 300);
        };
    }
    
    // Tabs del formulario de registro de salud
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            if (tab && window.HealthFormView) {
                window.HealthFormView.showTab(tab, this);
            }
        });
    });
    
    console.log('✅ Aplicación inicializada correctamente');
});