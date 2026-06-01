// ===== MODELO DE REGISTROS DE SALUD =====

class HealthRecordModel {
    
    static async saveRecord(recordData) {
        try {
            recordData.fecha_registro = new Date().toISOString();
            
            const { data, error } = await AppState.supabase
                .from('registros_salud')
                .insert([recordData])
                .select()
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar registro:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async getLastRecord(userId) {
        try {
            const { data, error } = await AppState.supabase
                .from('registros_salud')
                .select('*')
                .eq('usuario_id', userId)
                .order('fecha_registro', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if (error && error.code !== 'PGRST116') throw error;
            return { success: true, data: data || null };
        } catch (error) {
            console.error('Error cargando último registro:', error);
            return { success: false, data: null };
        }
    }
    
    static async getIMCHistory(userId, limit = 10) {
        try {
            const { data, error } = await AppState.supabase
                .from('registros_salud')
                .select('fecha_registro, imc')
                .eq('usuario_id', userId)
                .order('fecha_registro', { ascending: true })
                .limit(limit);
            
            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error cargando historial IMC:', error);
            return { success: false, data: [] };
        }
    }
    
    static async getAllRecords(userId) {
        try {
            const { data, error } = await AppState.supabase
                .from('registros_salud')
                .select('*')
                .eq('usuario_id', userId)
                .order('fecha_registro', { ascending: false });
            
            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Error cargando historial:', error);
            return { success: false, data: [] };
        }
    }
}

window.HealthRecordModel = HealthRecordModel;