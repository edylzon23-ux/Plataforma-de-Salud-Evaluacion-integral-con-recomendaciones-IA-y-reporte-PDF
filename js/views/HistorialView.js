// ===== VISTA DEL HISTORIAL =====

class HistorialView {
    
    static render(registros) {
        const container = document.getElementById('historial-content');
        if (!container) return;
        
        if (!registros || registros.length === 0) {
            container.innerHTML = `
                <div class="card">
                    ${Components.renderEmptyState('No tienes registros de salud aún', 'Crear primer registro', '() => window.PageController?.showPage?.("nuevo-registro")')}
                </div>`;
            return;
        }
        
        container.innerHTML = `
            <div class="card">
                <table class="historial-table">
                    <thead>
                        <tr><th>Fecha</th><th>Peso</th><th>Talla</th><th>IMC</th>
                          <th>Categoría</th><th>Condición</th><th>Riesgo CV</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${registros.map(r => `
                            <tr>
                                <td>${new Date(r.fecha_registro).toLocaleDateString('es-BO')}</td>
                                <td><strong>${r.peso_kg} kg</strong></td>
                                <td>${r.talla_cm} cm</td>
                                <td><strong>${r.imc}</strong></td>
                                <td>${imcBadge(r.categoria_imc)}</td>
                                <td>${r.condicion_salud_general || '—'}</td>
                                <td>${riesgoBadge(r.riesgo_cardiovascular)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`;
    }
    
    static showError(message) {
        const container = document.getElementById('historial-content');
        if (container) {
            container.innerHTML = `<div class="card"><p style="color:var(--danger)">Error: ${message}</p></div>`;
        }
    }
    
    static showLoading() {
        const container = document.getElementById('historial-content');
        if (container) {
            container.innerHTML = Components.renderLoading();
        }
    }
}

window.HistorialView = HistorialView;