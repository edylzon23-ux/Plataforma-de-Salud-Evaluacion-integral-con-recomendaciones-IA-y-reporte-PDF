// ===== VISTA DEL FORMULARIO DE REGISTRO =====

class HealthFormView {
    
    static showTab(tab, btn) {
        document.querySelectorAll(".tab-content").forEach(t => {
            t.classList.remove("active");
            t.classList.remove("hidden");
        });
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        const tabEl = document.getElementById(`tab-${tab}`);
        if (tabEl) tabEl.classList.add('active');
        if (btn) btn.classList.add('active');
    }
    
    static calcularIMCPreview() {
        const pesoInput = document.getElementById('h-peso');
        const tallaInput = document.getElementById('h-talla');
        
        if (!pesoInput || !tallaInput) return;
        
        const peso = parseFloat(pesoInput.value);
        const talla = parseFloat(tallaInput.value);
        
        const preview = document.getElementById('imc-preview');
        if (!preview) return;
        
        if (!peso || !talla || peso < 20 || talla < 50) {
            preview.classList.add('hidden');
            return;
        }
        
        const imc = peso / Math.pow(talla / 100, 2);
        preview.classList.remove('hidden');
        
        const imcVal = document.getElementById('imc-val');
        if (imcVal) imcVal.textContent = imc.toFixed(1);
        
        let cat, color;
        if (imc < 18.5) { cat = 'Bajo peso'; color = '#3B82F6'; }
        else if (imc < 25) { cat = 'Peso normal ✓'; color = '#10B981'; }
        else if (imc < 30) { cat = 'Sobrepeso'; color = '#F59E0B'; }
        else if (imc < 35) { cat = 'Obesidad Grado I'; color = '#EF4444'; }
        else if (imc < 40) { cat = 'Obesidad Grado II'; color = '#DC2626'; }
        else { cat = 'Obesidad Grado III'; color = '#7F1D1D'; }
        
        const imcCatPreview = document.getElementById('imc-cat-preview');
        if (imcCatPreview) {
            imcCatPreview.textContent = cat;
            imcCatPreview.style.color = color;
        }
        if (imcVal) imcVal.style.color = color;
        
        const pct = Math.max(0, Math.min(100, ((imc - 14) / (40 - 14)) * 100));
        const indicator = document.getElementById('imc-indicator');
        if (indicator) indicator.style.left = `${pct}%`;
    }
    
    static updateRange(input, spanId) {
        const span = document.getElementById(spanId);
        if (span) span.textContent = input.value;
    }
    
    static getFormData() {
        const actividadRadio = document.querySelector('input[name="actividad"]:checked');
        const actividad = actividadRadio?.value || 'sedentario';
        const estadoAnimoRadio = document.querySelector('input[name="estado_animo"]:checked');
        const estado_animo = estadoAnimoRadio?.value || 'regular';
        
        const pesoInput = document.getElementById('h-peso');
        const tallaInput = document.getElementById('h-talla');
        const presionS = document.getElementById('h-presion-s');
        const presionD = document.getElementById('h-presion-d');
        const fc = document.getElementById('h-fc');
        const temp = document.getElementById('h-temp');
        const spo2 = document.getElementById('h-spo2');
        const sueno = document.getElementById('h-sueno');
        const agua = document.getElementById('h-agua');
        const alcohol = document.getElementById('h-alcohol');
        const fuma = document.getElementById('h-fuma');
        const alimentacion = document.getElementById('h-alimentacion');
        const estres = document.getElementById('h-estres');
        const ansiedad = document.getElementById('h-ansiedad');
        
        return {
            usuario_id: AppState.currentUser?.id,
            peso_kg: pesoInput ? parseFloat(pesoInput.value) : 0,
            talla_cm: tallaInput ? parseFloat(tallaInput.value) : 0,
            presion_sistolica: presionS && presionS.value ? parseInt(presionS.value) : null,
            presion_diastolica: presionD && presionD.value ? parseInt(presionD.value) : null,
            frecuencia_cardiaca: fc && fc.value ? parseInt(fc.value) : null,
            temperatura_corporal: temp && temp.value ? parseFloat(temp.value) : null,
            saturacion_oxigeno: spo2 && spo2.value ? parseInt(spo2.value) : null,
            horas_sueno: sueno && sueno.value ? parseFloat(sueno.value) : null,
            vasos_agua_dia: agua && agua.value ? parseInt(agua.value) : null,
            nivel_actividad_fisica: actividad,
            consume_alcohol: alcohol ? alcohol.checked : false,
            fuma: fuma ? fuma.checked : false,
            calidad_alimentacion: alimentacion ? parseInt(alimentacion.value) : 5,
            nivel_estres: estres ? parseInt(estres.value) : 5,
            nivel_ansiedad: ansiedad ? parseInt(ansiedad.value) : 5,
            estado_animo: estado_animo
        };
    }
    
    static validateForm() {
        const peso = document.getElementById('h-peso')?.value;
        const talla = document.getElementById('h-talla')?.value;
        
        if (!peso || !talla) {
            this.showError('Peso y talla son obligatorios');
            return { valid: false };
        }
        return { valid: true };
    }
    
    static showError(message) {
        const errEl = document.getElementById('registro-error');
        if (errEl) {
            errEl.textContent = message;
            errEl.classList.remove('hidden');
            setTimeout(() => errEl.classList.add('hidden'), 3000);
        }
    }
    
    static resetForm() {
        const form = document.getElementById('health-form');
        if (form) form.reset();
        
        const preview = document.getElementById('imc-preview');
        if (preview) preview.classList.add('hidden');
        
        const alimentacionVal = document.getElementById('alimentacion-val');
        if (alimentacionVal) alimentacionVal.textContent = '5';
        
        const estresVal = document.getElementById('estres-val');
        if (estresVal) estresVal.textContent = '5';
        
        const ansiedadVal = document.getElementById('ansiedad-val');
        if (ansiedadVal) ansiedadVal.textContent = '5';
        
        this.showTab('medidas', document.querySelector('[data-tab="medidas"]'));
    }
    
    static setSubmitButtonLoading(isLoading) {
        const btn = document.querySelector('.btn-submit');
        if (!btn) return;
        btn.disabled = isLoading;
        if (isLoading) {
            btn.innerHTML = '<span>Analizando con IA...</span>';
        } else {
            btn.innerHTML = '<span>Guardar y analizar</span><svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
        }
    }
}

window.HealthFormView = HealthFormView;