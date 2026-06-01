// ===== CONTROLADOR DEL DASHBOARD =====

class DashboardController {
    
    static async loadDashboard() {
        try {
            // Cargar último registro
            const lastRecordResult = await HealthRecordModel.getLastRecord(AppState.currentUser.id);
            const ultimoRegistro = lastRecordResult.data;
            
            DashboardView.updateStats(ultimoRegistro);
            
            // Cargar recomendaciones
            if (ultimoRegistro?.recomendaciones_ia) {
                let recs = ultimoRegistro.recomendaciones_ia;
                if (typeof recs === 'string') {
                    try { recs = JSON.parse(recs); } catch { recs = [recs]; }
                }
                DashboardView.renderRecomendaciones(recs);
            } else {
                DashboardView.renderRecomendaciones([]);
            }
            
            // Cargar historial IMC
            const imcHistoryResult = await HealthRecordModel.getIMCHistory(AppState.currentUser.id);
            const historialIMC = imcHistoryResult.data;
            
            if (historialIMC && historialIMC.length > 0) {
                DashboardView.updateTotalRegistros(historialIMC.length);
                DashboardView.hideChartEmpty();
                AppState.imcChart = DashboardView.updateIMCChart(historialIMC, AppState.imcChart);
            } else {
                DashboardView.updateTotalRegistros(0);
                DashboardView.showChartEmpty();
            }
        } catch (error) {
            console.error('Dashboard error:', error);
        }
    }
}

window.DashboardController = DashboardController;