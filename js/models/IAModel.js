// ===== MODELO DE IA PARA RECOMENDACIONES =====

class IAModel {

    static async generarRecomendaciones(datos) {
        const imc = datos.peso_kg / Math.pow(datos.talla_cm / 100, 2);

        // Calcular categoría IMC
        let categoriaIMC = '';
        if (imc < 18.5) categoriaIMC = 'Bajo peso';
        else if (imc < 25) categoriaIMC = 'Peso normal';
        else if (imc < 30) categoriaIMC = 'Sobrepeso';
        else if (imc < 35) categoriaIMC = 'Obesidad Grado I';
        else if (imc < 40) categoriaIMC = 'Obesidad Grado II';
        else categoriaIMC = 'Obesidad Grado III';

        // Calcular condición de salud general
        let condicionSalud = 'Buena';
        if (imc < 18.5 || imc >= 30) condicionSalud = 'Regular';
        if (imc >= 35) condicionSalud = 'Deficiente';
        if (datos.nivel_estres > 7 || datos.nivel_ansiedad > 7) condicionSalud = 'Regular';
        if ((datos.nivel_estres > 8 || datos.nivel_ansiedad > 8) && imc >= 30) condicionSalud = 'Crítica';

        // Calcular riesgo cardiovascular
        let riesgoCV = 'bajo';
        let puntajeRiesgo = 0;
        if (imc >= 30) puntajeRiesgo += 2;
        else if (imc >= 25) puntajeRiesgo += 1;
        if (datos.fuma) puntajeRiesgo += 2;
        if (datos.consume_alcohol) puntajeRiesgo += 1;
        if (datos.nivel_actividad_fisica === 'sedentario') puntajeRiesgo += 2;
        if (datos.nivel_actividad_fisica === 'leve') puntajeRiesgo += 1;
        if (datos.calidad_alimentacion < 5) puntajeRiesgo += 2;
        if (datos.calidad_alimentacion < 7) puntajeRiesgo += 1;

        if (puntajeRiesgo >= 6) riesgoCV = 'muy_alto';
        else if (puntajeRiesgo >= 4) riesgoCV = 'alto';
        else if (puntajeRiesgo >= 2) riesgoCV = 'moderado';

        // Generar recomendaciones
        const recomendaciones = [];

        // Reemplaza TODAS las recomendaciones con estas versiones SIN EMOJIS:

        if (categoriaIMC === 'Bajo peso') {
            recomendaciones.push('Tu peso está por debajo de lo recomendado. Considera aumentar tu ingesta calórica con alimentos nutritivos.');
        } else if (categoriaIMC === 'Sobrepeso') {
            recomendaciones.push('Tienes sobrepeso. Te recomendamos reducir el consumo de azúcares y aumentar tu actividad física.');
        } else if (categoriaIMC.startsWith('Obesidad')) {
            recomendaciones.push('Tu IMC indica obesidad. Es importante que consultes con un médico.');
        } else {
            recomendaciones.push('Felicidades. Tu peso está en el rango saludable.');
        }

        if (datos.nivel_actividad_fisica === 'sedentario') {
            recomendaciones.push('Llevas un estilo de vida sedentario. Comienza con pequeñas caminatas de 15-20 minutos diarios.');
        } else if (datos.nivel_actividad_fisica === 'leve') {
            recomendaciones.push('Buen inicio con actividad física. Intenta aumentar la intensidad gradualmente.');
        } else if (datos.nivel_actividad_fisica === 'moderado') {
            recomendaciones.push('Excelente. Mantén tu nivel de actividad física moderado.');
        }

        if (datos.calidad_alimentacion < 5) {
            recomendaciones.push('Tu calidad alimentaria necesita mejorar. Incorpora más frutas y verduras.');
        } else if (datos.calidad_alimentacion < 7) {
            recomendaciones.push('Vas por buen camino. Sigue mejorando tu alimentación.');
        } else {
            recomendaciones.push('Tu alimentación es excelente. Sigue así.');
        }

        if (datos.horas_sueno < 7 && datos.horas_sueno > 0) {
            recomendaciones.push('Duermes menos de lo recomendado. Intenta dormir entre 7 y 9 horas diarias.');
        }

        if (datos.vasos_agua_dia < 6 && datos.vasos_agua_dia > 0) {
            recomendaciones.push('Bebe más agua. Intenta consumir al menos 8 vasos al día.');
        }

        if (datos.nivel_estres > 7) {
            recomendaciones.push('Tu nivel de estrés es alto. Practica técnicas de respiración o meditación.');
        }

        if (datos.nivel_ansiedad > 7) {
            recomendaciones.push('Tu nivel de ansiedad es elevado. Considera hablar con un profesional.');
        }

        if (datos.fuma) {
            recomendaciones.push('El consumo de tabaco es perjudicial para la salud. Busca ayuda para dejarlo.');
        }

        if (datos.consume_alcohol) {
            recomendaciones.push('El consumo de alcohol debe ser moderado. No superes una copa al día.');
        }

        if (recomendaciones.length === 0) {
            recomendaciones.push('Mantén tus hábitos saludables. Sigue cuidando tu bienestar.');
        }

        return {
            imc: imc.toFixed(1),
            categoria_imc: categoriaIMC,
            condicion_salud_general: condicionSalud,
            riesgo_cardiovascular: riesgoCV,
            recomendaciones: recomendaciones.slice(0, 8)
        };
    }
}

window.IAModel = IAModel;