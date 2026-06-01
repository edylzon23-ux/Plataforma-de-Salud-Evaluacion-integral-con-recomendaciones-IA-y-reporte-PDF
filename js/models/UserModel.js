// ===== MODELO DE USUARIO Y PERFIL =====

class UserModel {
    
    static async getPerfil(userId) {
        try {
            const { data, error } = await AppState.supabase
                .from('perfiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error cargando perfil:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async updatePerfil(userId, perfilData) {
        try {
            const { error } = await AppState.supabase
                .from('perfiles')
                .update(perfilData)
                .eq('id', userId);
            
            if (error) throw error;
            
            // Actualizar el perfil en el estado global
            if (AppState.currentUser) {
                AppState.currentUser.perfil = { ...AppState.currentUser.perfil, ...perfilData };
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async getAllUsers(limit = 25, searchQuery = '') {
        try {
            let query = AppState.supabase
                .from('perfiles')
                .select('id, nombres, apellidos, email, carnet_identidad, carrera, rol, codigo_universitario')
                .limit(limit);
            
            if (searchQuery) {
                query = query.or(`nombres.ilike.%${searchQuery}%,apellidos.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,carnet_identidad.ilike.%${searchQuery}%`);
            }
            
            const { data: perfiles, error } = await query;
            if (error) throw error;
            
            // Obtener último IMC para cada usuario
            const usuariosConIMC = await Promise.all((perfiles || []).map(async (user) => {
                const { data: registro } = await AppState.supabase
                    .from('registros_salud')
                    .select('imc, condicion_salud_general')
                    .eq('usuario_id', user.id)
                    .order('fecha_registro', { ascending: false })
                    .limit(1)
                    .single();
                
                return {
                    ...user,
                    nombre_completo: `${user.nombres || ''} ${user.apellidos || ''}`.trim() || user.email,
                    ultimo_imc: registro?.imc || '—',
                    condicion_salud_general: registro?.condicion_salud_general || '—'
                };
            }));
            
            return { success: true, data: usuariosConIMC };
        } catch (error) {
            console.error('Error cargando usuarios:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async getStats() {
        try {
            const { data: perfiles } = await AppState.supabase
                .from('perfiles')
                .select('id, rol');
            
            const { data: registrosHoy } = await AppState.supabase
                .from('registros_salud')
                .select('id')
                .gte('fecha_registro', new Date().toISOString().split('T')[0]);
            
            return {
                success: true,
                data: {
                    totalUsuarios: perfiles?.length || 0,
                    registrosHoy: registrosHoy?.length || 0
                }
            };
        } catch (error) {
            return { success: false, data: { totalUsuarios: 0, registrosHoy: 0 } };
        }
    }
}

window.UserModel = UserModel;