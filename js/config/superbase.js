// ===== CONFIGURACIÓN DE SUPABASE =====
const SUPABASE_URL = 'https://yhjtajzhxhaudncjgcay.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_mdyn9KooXb4djABBvCoM5Q_h34BrZnH';

// Inicializar Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Estado global de la aplicación
window.AppState = {
    currentUser: null,
    currentSession: null,
    supabase: supabaseClient,
    ultimoAnalisis: null,
    imcChart: null
};

window.supabaseClient = supabaseClient;