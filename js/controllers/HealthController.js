// ===== CONTROLADOR DE SALUD =====

class HealthController {
    
    static async showNuevoRegistro() {
        HealthFormView.resetForm();
        AppController.showPage('nuevo-registro');
    }
    
    static async enviarRegistro() {
        const validation = HealthFormView.validateForm();
        if (!validation.valid) return;
        
        const datosRegistro = HealthFormView.getFormData();
        
        try {
            HealthFormView.setSubmitButtonLoading(true);
            
            // Generar recomendaciones con IA
            const analisis = await IAModel.generarRecomendaciones(datosRegistro);
            
            // Agregar datos del análisis
            datosRegistro.imc = parseFloat(analisis.imc);
            datosRegistro.categoria_imc = analisis.categoria_imc;
            datosRegistro.condicion_salud_general = analisis.condicion_salud_general;
            datosRegistro.riesgo_cardiovascular = analisis.riesgo_cardiovascular;
            datosRegistro.recomendaciones_ia = JSON.stringify(analisis.recomendaciones);
            
            // Guardar en la base de datos
            const result = await HealthRecordModel.saveRecord(datosRegistro);
            
            if (result.success) {
                AppState.ultimoAnalisis = { registro: result.data, analisis: analisis };
                this.mostrarResultado(result.data, analisis);
                AppController.showPage('resultado');
                HealthFormView.resetForm();
                showToast('✅ Registro guardado y analizado con IA');
            } else {
                HealthFormView.showError(result.error || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            HealthFormView.showError(error.message || 'Error al guardar');
        } finally {
            HealthFormView.setSubmitButtonLoading(false);
        }
    }
    
    static mostrarResultado(registro, analisis) {
        const riesgoColor = {
            bajo: '#10B981', moderado: '#F59E0B', alto: '#EF4444', muy_alto: '#7F1D1D'
        };
        
        const condicionColor = {
            'Excelente': '#10B981', 'Buena': '#34D399', 'Regular': '#F59E0B',
            'Deficiente': '#EF4444', 'Crítica': '#7F1D1D'
        };
        
        const html = `
            <div class="resultado-cards">
                <div class="resultado-card">
                    <div class="res-label">Índice de Masa Corporal</div>
                    <div class="res-value" style="color:#0EA5E9">${analisis.imc}</div>
                    <div class="res-cat" style="color:#0EA5E9">${analisis.categoria_imc}</div>
                </div>
                <div class="resultado-card">
                    <div class="res-label">Condición General</div>
                    <div class="res-value" style="font-size:1.3rem;color:${condicionColor[analisis.condicion_salud_general] || '#0EA5E9'}">${analisis.condicion_salud_general}</div>
                    <div class="res-cat">Estado de salud</div>
                </div>
                <div class="resultado-card">
                    <div class="res-label">Riesgo Cardiovascular</div>
                    <div class="res-value" style="font-size:1.2rem;color:${riesgoColor[analisis.riesgo_cardiovascular] || '#F59E0B'}">${capitalize(analisis.riesgo_cardiovascular || '—')}</div>
                    <div class="res-cat">Según tus hábitos</div>
                </div>
            </div>
            <div class="resultado-recomendaciones">
                <h3>🩺 Recomendaciones Personalizadas (IA)</h3>
                <div class="recomendaciones-list">
                    ${analisis.recomendaciones.map(r => `<div class="recomendacion-item">${r}</div>`).join('')}
                </div>
            </div>
        `;
        
        const resultadoContent = document.getElementById('resultado-content');
        if (resultadoContent) resultadoContent.innerHTML = html;
    }
    
    static async descargarAnalisisPDF() {
        if (!AppState.ultimoAnalisis) {
            showToast('No hay análisis para exportar');
            return;
        }
        await PDFModel.generarAnalisisPDF(AppState.ultimoAnalisis.analisis, AppState.ultimoAnalisis.registro);
        showToast('✅ PDF descargado');
    }
    
    static async exportarHistorialPDF() {
        const result = await HealthRecordModel.getAllRecords(AppState.currentUser.id);
        if (result.success && result.data.length > 0) {
            await PDFModel.generarHistorialPDF(result.data);
            showToast('✅ Historial exportado a PDF');
        } else {
            showToast('No hay registros para exportar');
        }
    }
    
    static async exportarRecomendacionesPDF() {
        const result = await HealthRecordModel.getLastRecord(AppState.currentUser.id);
        if (result.success && result.data) {
            await PDFModel.generarRecomendacionesPDF(result.data);
            showToast('✅ Recomendaciones exportadas a PDF');
        } else {
            showToast('No hay recomendaciones para exportar');
        }
    }
    
    static async loadHistorial() {
        HistorialView.showLoading();
        const result = await HealthRecordModel.getAllRecords(AppState.currentUser.id);
        if (result.success) {
            HistorialView.render(result.data);
        } else {
            HistorialView.showError(result.error);
        }
    }
}

window.HealthController = HealthController;