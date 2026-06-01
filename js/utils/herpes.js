// ===== FUNCIONES DE UTILIDAD =====

function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
}

function showToast(msg, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-msg');
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), duration);
}

function showFormError(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.classList.remove('hidden');
}

function imcBadge(cat) {
    if (!cat) return '—';
    const colors = {
        'Bajo peso': 'badge-blue',
        'Peso normal': 'badge-green',
        'Sobrepeso': 'badge-yellow'
    };
    const cls = colors[cat] || 'badge-red';
    return `<span class="badge ${cls}">${cat}</span>`;
}

function riesgoBadge(riesgo) {
    if (!riesgo) return '—';
    const map = { bajo: 'badge-green', moderado: 'badge-yellow', alto: 'badge-red', muy_alto: 'badge-red' };
    return `<span class="badge ${map[riesgo] || ''}">${capitalize(riesgo)}</span>`;
}

// Exportar al scope global
window.capitalize = capitalize;
window.showToast = showToast;
window.showFormError = showFormError;
window.imcBadge = imcBadge;
window.riesgoBadge = riesgoBadge;