// ===== VISTA DEL DASHBOARD ===== Grafica de IMC, estadísticas y recomendaciones

const DashboardView = {
    // Renderizar bienvenida
    renderWelcome: function(nombre) {
        const dashNombre = document.getElementById('dash-nombre');
        if (dashNombre) dashNombre.textContent = nombre;
        
        const sidebarName = document.getElementById('sidebar-name');
        if (sidebarName) sidebarName.textContent = nombre;
        
        const sidebarAvatar = document.getElementById('sidebar-avatar');
        if (sidebarAvatar) sidebarAvatar.textContent = nombre[0]?.toUpperCase() || 'U';
        
        const rol = window.AppState?.currentUser?.perfil?.rol || 'Estudiante';
        const sidebarRole = document.getElementById('sidebar-role');
        if (sidebarRole) sidebarRole.textContent = window.capitalize ? window.capitalize(rol) : rol;
    },
    
    // Actualizar estadísticas del dashboard
    updateStats: function(ultimoRegistro) {
        if (ultimoRegistro && ultimoRegistro.imc) {
            const dashImc = document.getElementById('dash-imc');
            if (dashImc) dashImc.textContent = ultimoRegistro.imc || '—';
            
            const dashImcCat = document.getElementById('dash-imc-cat');
            if (dashImcCat) dashImcCat.textContent = ultimoRegistro.categoria_imc || 'Sin registros';
            
            const dashPeso = document.getElementById('dash-peso');
            if (dashPeso) dashPeso.textContent = ultimoRegistro.peso_kg ? `${ultimoRegistro.peso_kg} kg` : '— kg';
            
            const dashTalla = document.getElementById('dash-talla');
            if (dashTalla) dashTalla.textContent = ultimoRegistro.talla_cm ? `Talla: ${ultimoRegistro.talla_cm} cm` : 'Talla: — cm';
            
            const dashRiesgo = document.getElementById('dash-riesgo');
            if (dashRiesgo) dashRiesgo.textContent = window.capitalize ? window.capitalize(ultimoRegistro.riesgo_cardiovascular || '—') : (ultimoRegistro.riesgo_cardiovascular || '—');
            
            const dashCondicion = document.getElementById('dash-condicion');
            if (dashCondicion) dashCondicion.textContent = ultimoRegistro.condicion_salud_general || '';
            
            const dashUltimoReg = document.getElementById('dash-ultimo-reg');
            if (dashUltimoReg) dashUltimoReg.textContent = ultimoRegistro.fecha_registro ? `Último: ${new Date(ultimoRegistro.fecha_registro).toLocaleDateString('es-BO')}` : 'Sin registros';
        } else {
            // No hay registros
            const dashImc = document.getElementById('dash-imc');
            if (dashImc) dashImc.textContent = '—';
            
            const dashImcCat = document.getElementById('dash-imc-cat');
            if (dashImcCat) dashImcCat.innerHTML = '<span style="color: #F59E0B;">⚠️ Sin registros</span>';
            
            const dashPeso = document.getElementById('dash-peso');
            if (dashPeso) dashPeso.textContent = '— kg';
            
            const dashTalla = document.getElementById('dash-talla');
            if (dashTalla) dashTalla.textContent = 'Talla: — cm';
            
            const dashRiesgo = document.getElementById('dash-riesgo');
            if (dashRiesgo) dashRiesgo.textContent = '—';
            
            const dashUltimoReg = document.getElementById('dash-ultimo-reg');
            if (dashUltimoReg) dashUltimoReg.innerHTML = '<span style="color: #F59E0B;">Haz tu primer registro</span>';
        }
    },
    
    // Actualizar total de registros
    updateTotalRegistros: function(count) {
        const dashTotalReg = document.getElementById('dash-total-reg');
        if (dashTotalReg) dashTotalReg.textContent = count || 0;
    },
    
    // Renderizar recomendaciones
    renderRecomendaciones: function(recomendaciones) {
        const container = document.getElementById('dash-recomendaciones');
        if (!container) return;
        
        if (!recomendaciones || recomendaciones.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span>📊</span>
                    <p>Realiza tu primer registro para recibir recomendaciones personalizadas</p>
                    <button class="btn-sm" onclick="window.AppController.showPage('nuevo-registro')">Registrar ahora</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = recomendaciones.slice(0, 5)
            .map(function(r) { return '<div class="recomendacion-item">' + r + '</div>'; })
            .join('');
    },
    
    // Mostrar mensaje de gráfica vacía
    showChartEmpty: function() {
        const chartEmpty = document.getElementById('chart-empty');
        if (chartEmpty) chartEmpty.style.display = 'block';
        const imcChart = document.getElementById('imc-chart');
        if (imcChart) imcChart.style.display = 'none';
    },
    
    // Ocultar mensaje de gráfica vacía
    hideChartEmpty: function() {
        const chartEmpty = document.getElementById('chart-empty');
        if (chartEmpty) chartEmpty.style.display = 'none';
        const imcChart = document.getElementById('imc-chart');
        if (imcChart) imcChart.style.display = 'block';
    },
    
    // Actualizar gráfica de IMC
    updateIMCChart: function(data, chartInstance) {
        const canvas = document.getElementById('imc-chart');
        if (!canvas) return null;
        
        canvas.style.height = '200px';
        canvas.style.width = '100%';
        
        const ctx = canvas.getContext('2d');
        
        if (chartInstance && typeof chartInstance.destroy === 'function') {
            chartInstance.destroy();
        }
        
        if (!data || data.length === 0) {
            this.showChartEmpty();
            return null;
        }
        
        this.hideChartEmpty();
        
        const labels = data.map(function(d) {
            return new Date(d.fecha_registro).toLocaleDateString('es-BO', { day: '2-digit', month: 'short' });
        });
        
        const valores = data.map(function(d) { return d.imc; });
        
        const newChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'IMC',
                    data: valores,
                    borderColor: '#0EA5E9',
                    backgroundColor: 'rgba(14,165,233,0.1)',
                    borderWidth: 2.5,
                    pointBackgroundColor: '#0EA5E9',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                scales: {
                    y: { 
                        min: 14, 
                        max: 40,
                        title: { display: true, text: 'IMC' }
                    },
                    x: { 
                        grid: { display: false },
                        title: { display: true, text: 'Fecha' }
                    }
                }
            }
        });
        
        return newChart;
    }
};

// Exportar al scope global
window.DashboardView = DashboardView;