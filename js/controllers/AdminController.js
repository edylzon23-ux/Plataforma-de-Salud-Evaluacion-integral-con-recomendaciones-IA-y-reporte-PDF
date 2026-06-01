// ===== CONTROLADOR DE ADMINISTRACIÓN =====

class AdminController {
    
    static async loadAdmin() {
        // Cargar estadísticas
        const statsResult = await UserModel.getStats();
        
        // Obtener último IMC del admin actual
        const lastRecordResult = await HealthRecordModel.getLastRecord(AppState.currentUser.id);
        const ultimoIMC = lastRecordResult.data?.imc || '—';
        
        AdminView.renderStats(statsResult.data, ultimoIMC);
        
        // Cargar usuarios
        await this.buscarUsuarios('');
    }
    
    static async buscarUsuarios(query) {
        AdminView.showLoading();
        const result = await UserModel.getAllUsers(25, query);
        
        if (result.success) {
            AdminView.renderUsersTable(result.data);
        } else {
            AdminView.showError(result.error);
        }
    }
}

window.AdminController = AdminController;