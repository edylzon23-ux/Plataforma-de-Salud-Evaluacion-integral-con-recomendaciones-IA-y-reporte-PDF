// ===== COMPONENTES REUTILIZABLES =====

const Components = {
    
    renderEmptyState: (message, actionText, actionCallback) => {
        return `
            <div class="empty-state">
                <span>📊</span>
                <p>${message}</p>
                ${actionText ? `<button class="btn-sm" onclick="(${actionCallback})()">${actionText}</button>` : ''}
            </div>
        `;
    },
    
    renderLoading: () => {
        return `<div class="loading">Cargando...</div>`;
    },
    
    renderStatCard: (icon, value, label, subLabel = '') => {
        return `
            <div class="stat-card">
                <div class="stat-icon">${icon}</div>
                <div class="stat-info">
                    <span class="stat-value">${value}</span>
                    <span class="stat-label">${label}</span>
                    ${subLabel ? `<span class="stat-sub">${subLabel}</span>` : ''}
                </div>
            </div>
        `;
    },
    
    renderBadge: (text, type = 'blue') => {
        const types = { blue: 'badge-blue', green: 'badge-green', red: 'badge-red', yellow: 'badge-yellow' };
        return `<span class="badge ${types[type] || 'badge-blue'}">${text}</span>`;
    },
    
    renderRecomendacionItem: (text) => {
        return `<div class="recomendacion-item">${text}</div>`;
    }
};

window.Components = Components;