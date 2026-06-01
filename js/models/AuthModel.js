// ===== MODELO DE AUTENTICACIÓN =====

class AuthModel {
    
    static async login(email, password) {
        try {
            const { data, error } = await AppState.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });
            
            if (error) throw error;
            
            AppState.currentSession = data.session;
            AppState.currentUser = data.user;
            
            const { data: perfil, error: perfilError } = await AppState.supabase
                .from('perfiles')
                .select('*')
                .eq('id', AppState.currentUser.id)
                .single();
            
            if (!perfilError && perfil) {
                AppState.currentUser.perfil = perfil;
            }
            
            return { success: true, user: AppState.currentUser };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async register(userData) {
        try {
            const { data: authData, error: authError } = await AppState.supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: { nombres: userData.nombres, apellidos: userData.apellidos }
                }
            });
            
            if (authError) throw authError;
            if (!authData.user) throw new Error('Error al crear el usuario');
            
            const { error: perfilError } = await AppState.supabase
                .from('perfiles')
                .upsert([{
                    id: authData.user.id,
                    email: userData.email,
                    nombres: userData.nombres,
                    apellidos: userData.apellidos,
                    carnet_identidad: userData.carnet || null,
                    fecha_nacimiento: userData.fechaNac || null,
                    sexo: userData.sexo || null,
                    telefono: userData.telefono || null,
                    direccion: userData.direccion || null,
                    ciudad: userData.ciudad || null,
                    codigo_universitario: userData.codigoUni || null,
                    semestre: userData.semestre || null,
                    carrera: userData.carrera || null,
                    facultad: userData.facultad || null,
                    rol: 'estudiante'
                }], { onConflict: 'id' });
            
            if (perfilError) {
                console.error('Error insertando perfil:', perfilError);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Register error:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async logout() {
        try {
            await AppState.supabase.auth.signOut();
            AppState.currentUser = null;
            AppState.currentSession = null;
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }
    
    static async getSession() {
        const { data } = await AppState.supabase.auth.getSession();
        if (data.session) {
            AppState.currentSession = data.session;
            AppState.currentUser = data.session.user;
            
            const { data: perfil } = await AppState.supabase
                .from('perfiles')
                .select('*')
                .eq('id', AppState.currentUser.id)
                .single();
            
            if (perfil) AppState.currentUser.perfil = perfil;
            return { success: true, user: AppState.currentUser };
        }
        return { success: false };
    }
    
    static async changePassword(actual, nuevo) {
        try {
            const { error: signInError } = await AppState.supabase.auth.signInWithPassword({
                email: AppState.currentUser.email,
                password: actual
            });
            
            if (signInError) throw new Error('Contraseña actual incorrecta');
            
            const { error } = await AppState.supabase.auth.updateUser({ password: nuevo });
            if (error) throw error;
            
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

window.AuthModel = AuthModel;