/**
 * IT Mastery - Frontend Logic
 * Script principal responsabe de la interactividad de la página.
 */

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. BASE DE DATOS SIMULADA
    // ==========================================
    // Este arreglo simula una base de datos o respuesta de una API.
    // Preparado para futura integración con backend (ej: MongoDB / SQL).
    const certDatabase = [
        {
            codigo: "ABC123",
            nombre: "Juan Perez",
            curso: "JavaScript Básico y Avanzado",
            fecha: "2026-01-10"
        },
        {
            codigo: "DEV456",
            nombre: "María Gómez",
            curso: "Desarrollo Web Full Stack",
            fecha: "2026-02-15"
        },
        {
            codigo: "SEC789",
            nombre: "Carlos Ruiz",
            curso: "Ciberseguridad Básica",
            fecha: "2026-03-22"
        },
        {
            codigo: "PYT000",
            nombre: "Ana Martínez",
            curso: "Python para Data Science",
            fecha: "2026-04-01"
        },
        {
            codigo: "73217436",
            nombre: "Ediczon Clooney Mayta Mamani",
            curso: "Especialista de Soporte Tecnico",
            fecha: "2025-04-28"
        }
    ];

    // ==========================================
    // 2. REFERENCIAS AL DOM
    // ==========================================
    const validadorForm = document.getElementById("validador-form");
    const codigoInput = document.getElementById("codigo-input");
    const resultadoDiv = document.getElementById("resultado");

    // ==========================================
    // 3. EVENT LISTENERS
    // ==========================================
    if(validadorForm) {
        validadorForm.addEventListener("submit", manejarValidacion);
    }

    // ==========================================
    // 4. LÓGICA PRINCIPAL (CONTROLADORES)
    // ==========================================
    
    /**
     * Maneja el evento submit del formulario de validación
     * @param {Event} e - Evento submit
     */
    function manejarValidacion(e) {
        // Prevenir comportamiento por defecto (recarga de la página)
        e.preventDefault();

        // Limpiar resultados previos
        resultadoDiv.innerHTML = '';
        
        const codigoIngresado = codigoInput.value.trim().toUpperCase();

        // Validación simple de frontend
        if (codigoIngresado === "") {
            mostrarError("Por favor, ingresa el código de tu certificado.");
            return;
        }

        /* 
        -----------------------------------------------------------------
         SIMULACIÓN DE LLAMADA ASÍNCRONA A API REST
        -----------------------------------------------------------------
         En el futuro, esto se puede reemplazar por:
         
         const button = validadorForm.querySelector('button');
         button.textContent = "Validando...";
         button.disabled = true;

         fetch(`https://api.itmastery.com/v1/certificados/validate/${codigoIngresado}`)
            .then(res => {
                if(!res.ok) throw new Error("No encontrado");
                return res.json();
            })
            .then(data => mostrarExito(data))
            .catch(error => mostrarError("Certificado no válido. Verifícalo e intenta de nuevo."))
            .finally(() => {
                button.textContent = "Validar";
                button.disabled = false;
            });
        -----------------------------------------------------------------
        */

        // Simulamos un leve delay para dar sensación de procesamiento real
        const btnSubmit = validadorForm.querySelector('button');
        const txtOriginal = btnSubmit.textContent;
        btnSubmit.textContent = "Validando...";
        btnSubmit.disabled = true;

        setTimeout(() => {
            // Buscamos el código en nuestro arreglo local
            const certEncontrado = certDatabase.find(
                cert => cert.codigo === codigoIngresado
            );

            if (certEncontrado) {
                // Redirigir si es el certificado especial
                if (certEncontrado.codigo === "73217436") {
                    window.location.href = "certificado.html";
                } else {
                    mostrarExito(certEncontrado);
                }
            } else {
                mostrarError("Certificado no válido. Verifica el código e intenta nuevamente.");
            }

            // Restaurar botón
            btnSubmit.textContent = txtOriginal;
            btnSubmit.disabled = false;
        }, 600); // 600ms de "carga"
    }

    // ==========================================
    // 5. FUNCIONES DE ACTUALIZACIÓN DOM (VISTA)
    // ==========================================

    /**
     * Renderiza el estado de éxito en pantalla
     * @param {Object} datos - La información del certificado
     */
    function mostrarExito(datos) {
        // Formatear la fecha para que sea más legible en la UI
        const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
        let fechaFormateada = datos.fecha; // Fallback
        
        try {
            // Reemplazamos guiones por barras asegurando buena conversión de Date
            const dateObj = new Date(datos.fecha.replace(/-/g, '\/'));
            fechaFormateada = dateObj.toLocaleDateString('es-ES', opcionesFecha);
        } catch(e) { /* Error parseando fecha, usamos la original */ }

        // Injectar HTML responsivo y estilizado
        resultadoDiv.innerHTML = `
            <div class="resultado-exito">
                <h4>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Certificado Auténtico
                </h4>
                <p><span>Estudiante:</span> <strong>${datos.nombre}</strong></p>
                <p><span>Curso / Máster:</span> <strong>${datos.curso}</strong></p>
                <p><span>Fecha Emisión:</span> <strong>${fechaFormateada}</strong></p>
                <p><span>ID Oficial:</span> <strong>${datos.codigo}</strong></p>
            </div>
        `;
    }

    /**
     * Renderiza el estado de error en pantalla
     * @param {String} mensaje - Mensaje de error a mostrar
     */
    function mostrarError(mensaje) {
        resultadoDiv.innerHTML = `
            <div class="resultado-error">
                <p>${mensaje}</p>
            </div>
        `;
    }

    // ==========================================
    // 6. UTILIDADES UX
    // ==========================================
    // Fallback de Smooth Scrolling en caso de que CSS scroll-behavior falle 
    // y para asegurar mejor offset por el header fixed.
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const dest = this.getAttribute('href');
            if (dest === '#') return;
            
            const targetNode = document.querySelector(dest);
            if (targetNode) {
                // Cálculo de la posición considerando el header estático
                const headerOffset = 75; // Altura aproximada del header
                const elementPosition = targetNode.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
