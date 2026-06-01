// ===== MODELO DE ANTECEDENTES MÉDICOS =====

class MedicalHistoryModel {
    
    static async getAntecedentes(userId) {
        try {
            const { data, error } = await AppState.supabase
                .from('antecedentes_medicos')
                .select('*')
                .eq('usuario_id', userId)
                .maybeSingle();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data: data || {} };
        } catch (error) {
            console.error('Error cargando antecedentes:', error);
            return { success: false, data: {} };
        }
    }
    
    static async saveAntecedentes(antecedentesData) {
        try {
            const { error } = await AppState.supabase
                .from('antecedentes_medicos')
                .upsert([antecedentesData], { onConflict: 'usuario_id' });
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error guardando antecedentes:', error);
            return { success: false, error: error.message };
        }
    }
}

window.MedicalHistoryModel = MedicalHistoryModel;