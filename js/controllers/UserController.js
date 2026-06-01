// ===== CONTROLADOR DE USUARIO =====

class UserController {
    
    static async loadPerfil() {
        const result = await UserModel.getPerfil(AppState.currentUser.id);
        if (result.success) {
            PerfilView.render(result.data, AppState.currentUser.email);
        } else {
            showToast('Error al cargar perfil');
        }
    }
    
    static async guardarPerfil() {
        const datos = PerfilView.getFormData();
        const result = await UserModel.updatePerfil(AppState.currentUser.id, datos);
        
        if (result.success) {
            PerfilView.showSuccessMessage();
            showToast('✅ Perfil actualizado');
            this.loadPerfil();
        } else {
            showToast('❌ Error: ' + result.error);
        }
    }
    
    static async cambiarPassword() {
        const { actual, nuevo, confirmar } = PerfilView.getPasswordData();
        
        if (!actual || !nuevo) {
            PerfilView.showPasswordError('Completa todos los campos');
            return;
        }
        if (nuevo !== confirmar) {
            PerfilView.showPasswordError('Las contraseñas no coinciden');
            return;
        }
        if (nuevo.length < 6) {
            PerfilView.showPasswordError('Mínimo 6 caracteres');
            return;
        }
        
        const result = await AuthModel.changePassword(actual, nuevo);
        if (result.success) {
            PerfilView.showPasswordSuccess();
            PerfilView.clearPasswordFields();
            showToast('✅ Contraseña actualizada');
        } else {
            PerfilView.showPasswordError(result.error);
        }
    }
    
    static async loadAntecedentes() {
        const result = await MedicalHistoryModel.getAntecedentes(AppState.currentUser.id);
        if (result.success) {
            AntecedentesView.render(result.data);
        }
    }
    
    static async guardarAntecedentes() {
        const datos = AntecedentesView.getFormData(AppState.currentUser.id);
        const result = await MedicalHistoryModel.saveAntecedentes(datos);
        
        if (result.success) {
            AntecedentesView.showSuccessMessage();
            showToast('✅ Antecedentes guardados');
        } else {
            showToast('❌ Error al guardar: ' + result.error);
        }
    }
    
    static toggleDiscapacidad() {
        AntecedentesView.toggleDiscapacidad();
    }
}

window.UserController = UserController;