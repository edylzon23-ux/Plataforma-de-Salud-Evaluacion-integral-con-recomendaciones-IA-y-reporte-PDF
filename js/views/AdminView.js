// ===== VISTA DE ADMINISTRACIÓN =====

class AdminView {
    
    static renderStats(stats, ultimoIMC) {
        const container = document.getElementById('admin-stats');
        if (!container) return;
        
        container.innerHTML = `
            ${Components.renderStatCard('👥', stats.totalUsuarios || 0, 'Usuarios Totales')}
            ${Components.renderStatCard('📋', stats.registrosHoy || 0, 'Registros Hoy')}
            ${Components.renderStatCard('⚖️', ultimoIMC || '—', 'Tu Último IMC')}
        `;
    }
    
    static renderUsersTable(usuarios) {
        const container = document.getElementById('admin-table-container');
        if (!container) return;
        
        if (!usuarios || usuarios.length === 0) {
            container.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">No se encontraron usuarios</p>';
            return;
        }
        
        container.innerHTML = `
            <table class="admin-table">
                <thead>
                    <tr><th>Nombre</th><th>Email</th><th>Carnet</th><th>Carrera</th><th>IMC</th><th>Condición</th><th>Rol</th></tr>
                </thead>
                <tbody>
                    ${usuarios.map(u => `
                        <tr>
                            <td><strong>${u.nombre_completo}</strong></td>
                            <td>${u.email}</td>
                            <td>${u.carnet_identidad || '—'}</td>
                            <td>${u.carrera || '—'}</td>
                            <td>${u.ultimo_imc}</td>
                            <td>${u.condicion_salud_general}</td>
                            <td>${Components.renderBadge(capitalize(u.rol || 'estudiante'), u.rol === 'admin' ? 'red' : u.rol === 'medico' ? 'blue' : 'green')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }
    
    static showError(message) {
        const container = document.getElementById('admin-table-container');
        if (container) {
            container.innerHTML = `<p style="padding:1rem;color:var(--danger)">Error: ${message}</p>`;
        }
    }
    
    static showLoading() {
        const container = document.getElementById('admin-table-container');
        if (container) {
            container.innerHTML = Components.renderLoading();
        }
    }
}

window.AdminView = AdminView;