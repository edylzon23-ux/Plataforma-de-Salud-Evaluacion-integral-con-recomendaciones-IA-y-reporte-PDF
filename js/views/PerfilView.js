// ===== VISTA DEL PERFIL =====

class PerfilView {
    
    static render(perfil, email) {
        const nombreCompleto = `${perfil.nombres || ''} ${perfil.apellidos || ''}`.trim() || email.split('@')[0];
        
        const perfilNombre = document.getElementById('perfil-nombre-completo');
        if (perfilNombre) perfilNombre.textContent = nombreCompleto;
        
        const perfilEmail = document.getElementById('perfil-email-display');
        if (perfilEmail) perfilEmail.textContent = email;
        
        const perfilAvatar = document.getElementById('perfil-avatar-big');
        if (perfilAvatar) perfilAvatar.textContent = (perfil.nombres?.[0] || email[0]).toUpperCase();
        
        const perfilRol = document.getElementById('perfil-rol-badge');
        if (perfilRol) {
            perfilRol.textContent = capitalize(perfil.rol || 'estudiante');
            const rolClass = { admin: 'badge-red', medico: 'badge-blue', estudiante: 'badge-green' };
            perfilRol.className = `badge ${rolClass[perfil.rol] || 'badge-green'}`;
        }
        
        // Llenar formulario de edición
        const editNombres = document.getElementById('edit-nombres');
        if (editNombres) editNombres.value = perfil.nombres || '';
        
        const editApellidos = document.getElementById('edit-apellidos');
        if (editApellidos) editApellidos.value = perfil.apellidos || '';
        
        const editTelefono = document.getElementById('edit-telefono');
        if (editTelefono) editTelefono.value = perfil.telefono || '';
        
        const editDireccion = document.getElementById('edit-direccion');
        if (editDireccion) editDireccion.value = perfil.direccion || '';
        
        const editCiudad = document.getElementById('edit-ciudad');
        if (editCiudad) editCiudad.value = perfil.ciudad || '';
        
        const editCarnet = document.getElementById('edit-carnet');
        if (editCarnet) editCarnet.value = perfil.carnet_identidad || '';
        
        const editFechaNac = document.getElementById('edit-fecha-nac');
        if (editFechaNac) editFechaNac.value = perfil.fecha_nacimiento || '';
        
        const editSexo = document.getElementById('edit-sexo');
        if (editSexo) editSexo.value = perfil.sexo || '';
        
        const editCodigoUni = document.getElementById('edit-codigo-uni');
        if (editCodigoUni) editCodigoUni.value = perfil.codigo_universitario || '';
        
        const editCarrera = document.getElementById('edit-carrera');
        if (editCarrera) editCarrera.value = perfil.carrera || '';
        
        const editFacultad = document.getElementById('edit-facultad');
        if (editFacultad) editFacultad.value = perfil.facultad || '';
        
        const editSemestre = document.getElementById('edit-semestre');
        if (editSemestre) editSemestre.value = perfil.semestre || '';
        
        // Mostrar información
        const items = [
            ['Carnet de Identidad', perfil.carnet_identidad],
            ['Fecha de Nacimiento', perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).toLocaleDateString('es-BO') : '—'],
            ['Sexo', capitalize(perfil.sexo || '—')],
            ['Teléfono', perfil.telefono || '—'],
            ['Ciudad', perfil.ciudad || '—'],
            ['Código Universitario', perfil.codigo_universitario || '—'],
            ['Carrera', perfil.carrera || '—'],
            ['Facultad', perfil.facultad || '—'],
            ['Semestre', perfil.semestre ? `${perfil.semestre}° Semestre` : '—']
        ];
        
        const infoDisplay = document.getElementById('perfil-info-display');
        if (infoDisplay) {
            infoDisplay.innerHTML = items.map(([label, val]) => `
                <div class="pi-item"><label>${label}</label><span>${val || '—'}</span></div>
            `).join('');
        }
    }
    
    static getFormData() {
        const editNombres = document.getElementById('edit-nombres');
        const editApellidos = document.getElementById('edit-apellidos');
        const editTelefono = document.getElementById('edit-telefono');
        const editDireccion = document.getElementById('edit-direccion');
        const editCiudad = document.getElementById('edit-ciudad');
        const editCarnet = document.getElementById('edit-carnet');
        const editFechaNac = document.getElementById('edit-fecha-nac');
        const editSexo = document.getElementById('edit-sexo');
        const editCodigoUni = document.getElementById('edit-codigo-uni');
        const editCarrera = document.getElementById('edit-carrera');
        const editFacultad = document.getElementById('edit-facultad');
        const editSemestre = document.getElementById('edit-semestre');
        
        return {
            nombres: editNombres ? editNombres.value.trim() : '',
            apellidos: editApellidos ? editApellidos.value.trim() : '',
            telefono: editTelefono ? editTelefono.value.trim() || null : null,
            direccion: editDireccion ? editDireccion.value.trim() || null : null,
            ciudad: editCiudad ? editCiudad.value.trim() || null : null,
            carnet_identidad: editCarnet ? editCarnet.value.trim() || null : null,
            fecha_nacimiento: editFechaNac ? editFechaNac.value || null : null,
            sexo: editSexo ? editSexo.value || null : null,
            codigo_universitario: editCodigoUni ? editCodigoUni.value.trim() || null : null,
            carrera: editCarrera ? editCarrera.value.trim() || null : null,
            facultad: editFacultad ? editFacultad.value || null : null,
            semestre: editSemestre ? editSemestre.value || null : null
        };
    }
    
    static showSuccessMessage() {
        const msg = document.getElementById('perfil-msg');
        if (msg) {
            msg.textContent = '✓ Perfil actualizado';
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 3000);
        }
    }
    
    static getPasswordData() {
        const pwdActual = document.getElementById('pwd-actual');
        const pwdNuevo = document.getElementById('pwd-nuevo');
        const pwdConfirmar = document.getElementById('pwd-confirmar');
        
        return {
            actual: pwdActual ? pwdActual.value : '',
            nuevo: pwdNuevo ? pwdNuevo.value : '',
            confirmar: pwdConfirmar ? pwdConfirmar.value : ''
        };
    }
    
    static clearPasswordFields() {
        const pwdActual = document.getElementById('pwd-actual');
        const pwdNuevo = document.getElementById('pwd-nuevo');
        const pwdConfirmar = document.getElementById('pwd-confirmar');
        
        if (pwdActual) pwdActual.value = '';
        if (pwdNuevo) pwdNuevo.value = '';
        if (pwdConfirmar) pwdConfirmar.value = '';
    }
    
    static showPasswordError(message) {
        const msg = document.getElementById('pwd-msg');
        if (msg) {
            msg.textContent = message;
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 3000);
        }
    }
    
    static showPasswordSuccess() {
        const msg = document.getElementById('pwd-msg');
        if (msg) {
            msg.textContent = '✓ Contraseña cambiada exitosamente';
            msg.className = 'form-success';
            msg.classList.remove('hidden');
            setTimeout(() => msg.classList.add('hidden'), 4000);
        }
    }
}

window.PerfilView = PerfilView;