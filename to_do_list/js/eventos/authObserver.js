import { supabaseClient } from "../config/supabase.js";

supabaseClient.auth.onAuthStateChange(async (evento, session) => {
    if (evento === "SIGNED_IN" || evento === 'INITIAL_SESSION' && session) {

        if (!window.location.pathname.includes('perfil.html')) {
            window.location.href = './perfil.html'
        }

        return
    }

    if (evento === 'SIGNED_OUT') {
        if (!window.location.pathname.includes('login.html')) {
            window.location.href = './login.html'
        }  
    }
})
