// ===== MODELO DE GENERACIÓN DE PDF =====

class PDFModel {
    
    static getNombreCompleto() {
        return AppState.currentUser?.user_metadata?.nombres || 
               AppState.currentUser?.perfil?.nombres || 
               AppState.currentUser?.email?.split('@')[0] || 'Usuario';
    }
    
    static async generarAnalisisPDF(analisis, registro) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        doc.setFontSize(22);
        doc.setTextColor(14, 165, 233);
        doc.text('Mi Plataforma Salud - Análisis de Salud', 20, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generado: ${new Date().toLocaleString('es-BO')}`, 20, 30);
        
        doc.setFontSize(14);
        doc.setTextColor(31, 41, 55);
        doc.text(`Paciente: ${this.getNombreCompleto()}`, 20, 45);
        doc.text(`Email: ${AppState.currentUser?.email || '—'}`, 20, 53);
        
        doc.setFontSize(16);
        doc.setTextColor(14, 165, 233);
        doc.text('Resultados del Análisis', 20, 68);
        
        doc.setFontSize(12);
        doc.setTextColor(31, 41, 55);
        doc.text(`IMC: ${analisis.imc} (${analisis.categoria_imc})`, 20, 80);
        doc.text(`Condición General: ${analisis.condicion_salud_general}`, 20, 90);
        doc.text(`Riesgo Cardiovascular: ${capitalize(analisis.riesgo_cardiovascular)}`, 20, 100);
        
        doc.setFontSize(16);
        doc.setTextColor(14, 165, 233);
        doc.text('Recomendaciones Personalizadas', 20, 115);
        
        let y = 125;
        doc.setFontSize(11);
        doc.setTextColor(31, 41, 55);
        for (const rec of analisis.recomendaciones.slice(0, 8)) {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            const lines = doc.splitTextToSize(`• ${rec}`, 170);
            for (const line of lines) {
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(line, 20, y);
                y += 7;
            }
            y += 2;
        }
        
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(9);
            doc.setTextColor(148, 163, 184);
            doc.text('© Mi Plataforma Salud - Informe confidencial', 20, 287);
        }
        
        doc.save(`analisis_salud_${new Date().toISOString().split('T')[0]}.pdf`);
    }
    
    static async generarHistorialPDF(registros) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        doc.setFontSize(22);
        doc.setTextColor(14, 165, 233);
        doc.text('Mi Plataforma Salud - Historial Clínico', 20, 20);
        
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text(`Generado: ${new Date().toLocaleString('es-BO')}`, 20, 30);
        
        doc.setFontSize(11);
        doc.setTextColor(31, 41, 55);
        doc.text(`Paciente: ${this.getNombreCompleto()}`, 20, 45);
        doc.text(`Total de registros: ${registros.length}`, 20, 53);
        
        let y = 70;
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.text('Fecha', 20, y);
        doc.text('Peso', 60, y);
        doc.text('IMC', 90, y);
        doc.text('Categoría', 110, y);
        doc.text('Condición', 150, y);
        doc.text('Riesgo CV', 180, y);
        y += 5;
        doc.line(20, y, 200, y);
        y += 5;
        
        doc.setFontSize(9);
        doc.setTextColor(31, 41, 55);
        for (const reg of registros) {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(new Date(reg.fecha_registro).toLocaleDateString('es-BO'), 20, y);
            doc.text(`${reg.peso_kg} kg`, 60, y);
            doc.text(reg.imc?.toString() || '—', 90, y);
            doc.text(reg.categoria_imc?.substring(0, 12) || '—', 110, y);
            doc.text(reg.condicion_salud_general?.substring(0, 12) || '—', 150, y);
            doc.text(capitalize(reg.riesgo_cardiovascular || '—'), 180, y);
            y += 7;
        }
        
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text('© Mi Plataforma Salud - Historial completo', 20, 287);
        }
        
        doc.save(`historial_salud_${new Date().toISOString().split('T')[0]}.pdf`);
    }
    
    static async generarRecomendacionesPDF(ultimoRegistro) {
    let recs = ultimoRegistro.recomendaciones_ia;
    if (typeof recs === 'string') {
        try { recs = JSON.parse(recs); } catch { recs = [recs]; }
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Configurar márgenes
    const marginX = 20;
    const marginY = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - (marginX * 2); // 210 - 40 = 170mm
    
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233);
    doc.text('Mi Plataforma Salud - Recomendaciones', marginX, marginY);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generado: ${new Date().toLocaleString('es-BO')}`, marginX, marginY + 10);
    
    doc.setFontSize(12);
    doc.setTextColor(31, 41, 55);
    doc.text(`Paciente: ${this.getNombreCompleto()}`, marginX, marginY + 28);
    doc.text(`Fecha del registro: ${new Date(ultimoRegistro.fecha_registro).toLocaleDateString('es-BO')}`, marginX, marginY + 38);
    
    doc.setFontSize(14);
    doc.setTextColor(14, 165, 233);
    doc.text('Recomendaciones Personalizadas', marginX, marginY + 55);
    
    let y = marginY + 68;
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    
    for (let i = 0; i < recs.length; i++) {
        let rec = recs[i];
        
        // LIMPIAR COMPLETAMENTE LA RECOMENDACIÓN - eliminar TODO símbolo raro
        rec = rec.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Eliminar tildes
        rec = rec.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s\.\,\!\?\-\:\;\(\)]/g, ''); // Solo letras y puntuación
        rec = rec.replace(/^\W+/, ''); // Eliminar caracteres no alfanuméricos al inicio
        rec = rec.trim();
        
        if (rec.length === 0) continue;
        
        // Dividir el texto en líneas que NO superen el ancho del PDF
        const lines = doc.splitTextToSize(`• ${rec}`, maxWidth);
        
        for (let j = 0; j < lines.length; j++) {
            if (y > 270) {
                doc.addPage();
                y = marginY;
            }
            doc.text(lines[j], marginX, y);
            y += 5;
        }
        y += 3;
    }
    
    doc.save(`recomendaciones_${new Date().toISOString().split('T')[0]}.pdf`);
    if (window.showToast) window.showToast('✅ Recomendaciones exportadas a PDF');
}
}

window.PDFModel = PDFModel;