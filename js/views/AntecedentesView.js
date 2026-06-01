// ===== VISTA DE ANTECEDENTES MÉDICOS =====

class AntecedentesView {
    
    static render(antecedentes) {
        const a = antecedentes || {};
        
        const diabetes = document.getElementById('ant-diabetes');
        if (diabetes) diabetes.checked = a.diabetes || false;
        
        const hipertension = document.getElementById('ant-hipertension');
        if (hipertension) hipertension.checked = a.hipertension || false;
        
        const asma = document.getElementById('ant-asma');
        if (asma) asma.checked = a.asma || false;
        
        const cardiopatia = document.getElementById('ant-cardiopatia');
        if (cardiopatia) cardiopatia.checked = a.cardiopatia || false;
        
        const grupoSang = document.getElementById('ant-grupo-sang');
        if (grupoSang) grupoSang.value = a.grupo_sanguineo || '';
        
        const discapacidad = document.getElementById('ant-discapacidad');
        if (discapacidad) discapacidad.checked = a.tiene_discapacidad || false;
        
        const tipoDisc = document.getElementById('ant-tipo-disc');
        if (tipoDisc) tipoDisc.value = a.tipo_discapacidad || '';
        
        const alergias = document.getElementById('ant-alergias');
        if (alergias) alergias.value = a.alergias || '';
        
        const alergiasMed = document.getElementById('ant-alergias-med');
        if (alergiasMed) alergiasMed.value = a.alergias_medicamentos || '';
        
        const medicamentos = document.getElementById('ant-medicamentos');
        if (medicamentos) medicamentos.value = a.medicamentos_actuales || '';
        
        const cirugias = document.getElementById('ant-cirugias');
        if (cirugias) cirugias.value = a.cirugias_previas || '';
        
        const enfFamilia = document.getElementById('ant-enf-familia');
        if (enfFamilia) enfFamilia.value = a.enfermedades_familiares || '';
        
        if (a.tiene_discapacidad) {
            const tipoGroup = document.getElementById('tipo-discapacidad-group');
            if (tipoGroup) tipoGroup.style.display = 'block';
        }
    }
    
    static getFormData(userId) {
        const diabetes = document.getElementById('ant-diabetes');
        const hipertension = document.getElementById('ant-hipertension');
        const asma = document.getElementById('ant-asma');
        const cardiopatia = document.getElementById('ant-cardiopatia');
        const grupoSang = document.getElementById('ant-grupo-sang');
        const discapacidad = document.getElementById('ant-discapacidad');
        const tipoDisc = document.getElementById('ant-tipo-disc');
        const alergias = document.getElementById('ant-alergias');
        const alergiasMed = document.getElementById('ant-alergias-med');
        const medicamentos = document.getElementById('ant-medicamentos');
        const cirugias = document.getElementById('ant-cirugias');
        const enfFamilia = document.getElementById('ant-enf-familia');
        
        return {
            usuario_id: userId,
            diabetes: diabetes ? diabetes.checked : false,
            hipertension: hipertension ? hipertension.checked : false,
            asma: asma ? asma.checked : false,
            cardiopatia: cardiopatia ? cardiopatia.checked : false,
            grupo_sanguineo: grupoSang ? grupoSang.value : null,
            tiene_discapacidad: discapacidad ? discapacidad.checked : false,
            tipo_discapacidad: tipoDisc ? tipoDisc.value : null,
            alergias: alergias ? alergias.value : null,
            alergias_medicamentos: alergiasMed ? alergiasMed.value : null,
            medicamentos_actuales: medicamentos ? medicamentos.value : null,
            cirugias_previas: cirugias ? cirugias.value : null,
            enfermedades_familiares: enfFamilia ? enfFamilia.value : null
        };
    }
    
    static toggleDiscapacidad() {
        const discapacidad = document.getElementById('ant-discapacidad');
        const tipoGroup = document.getElementById('tipo-discapacidad-group');
        if (discapacidad && tipoGroup) {
            tipoGroup.style.display = discapacidad.checked ? 'block' : 'none';
        }
    }
    
    static showSuccessMessage() {
        const msg = document.getElementById('antecedentes-msg');
        if (msg) {
            msg.textContent = '✓ Antecedentes guardados correctamente';
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 3000);
        }
    }
}

window.AntecedentesView = AntecedentesView;