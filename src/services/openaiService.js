import OpenAI from 'openai';

// Dinamismo total: Usamos la llave del ENV (localhost) o la que el usuario provea en el Dashboard
export const getOpenAIClient = (userKey) => {
  const apiKey = userKey || import.meta.env.VITE_OPENAI_API_KEY;
  
  console.log('[IA] Intentando crear cliente OpenAI. Key presente:', !!apiKey, '| Longitud:', apiKey?.length || 0);

  // Validamos que la llave no sea el placeholder y tenga un largo mínimo razonable
  if (!apiKey || apiKey === 'PON_TU_LLAVE_AQUI_SIN_ESPACIOS' || apiKey.length < 20) {
    console.warn('[IA] API Key no válida o ausente.');
    if (userKey) return new OpenAI({ apiKey: userKey, dangerouslyAllowBrowser: true });
    return null;
  }

  console.log('[IA] Cliente OpenAI creado exitosamente.');
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const analyzePsychosocialData = async (data, context, userKey = null) => {
  try {
    console.log('[IA Curso] Iniciando análisis para:', context);
    const openai = userKey ? new OpenAI({ apiKey: userKey, dangerouslyAllowBrowser: true }) : getOpenAIClient();
    
    if (!openai) {
      return "Error: No se ha configurado la API Key de OpenAI. Ingresa tu llave en el ícono ✨ de la esquina superior derecha.";
    }

    console.log('[IA Curso] Enviando solicitud a GPT-4o...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Eres un psicólogo educacional experto con 20 años de experiencia en Chile. Analizas datos socioemocional de colegios CEIA y generas informes ejecutivos de alto impacto." 
        },
        { 
          role: "user", 
          content: `Analiza los siguientes datos del curso ${context}: ${JSON.stringify(data)}. Genera un informe con: 1. Diagnóstico General, 2. Alertas Críticas y 3. Recomendaciones Pedagógicas.` 
        }
      ],
      temperature: 0.7,
    });

    console.log('[IA Curso] ✅ Respuesta recibida exitosamente.');
    return response.choices[0].message.content;
  } catch (error) {
    console.error("[IA Curso] ❌ Error detallado:", error);
    const msg = error?.message || 'Error desconocido';
    if (msg.includes('401') || msg.includes('Incorrect API key')) {
      return "❌ API Key inválida. Verifica que tu llave sea correcta y tenga permisos activos en platform.openai.com";
    }
    if (msg.includes('429') || msg.includes('Rate limit')) {
      return "⏳ Límite de uso alcanzado en OpenAI. Espera unos minutos e intenta de nuevo.";
    }
    if (msg.includes('insufficient_quota')) {
      return "💳 Tu cuenta de OpenAI no tiene créditos. Recarga en platform.openai.com/account/billing";
    }
    return `No pude conectar con el cerebro AI. Error: ${msg}`;
  }
};

export const analyzeStudentData = async (studentData, userKey = null) => {
  try {
    console.log('[IA Alumno] Iniciando análisis para:', studentData?.studentName);
    const openai = userKey ? new OpenAI({ apiKey: userKey, dangerouslyAllowBrowser: true }) : getOpenAIClient();
    
    if (!openai) {
      return "Para generar este informe detallado con IA, necesitas configurar tu API Key en la esquina superior derecha del Panel Docente (ícono ✨).";
    }

    console.log('[IA Alumno] Enviando solicitud a GPT-4o...');
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Eres un psicólogo educacional experto especializado en Educación de Adultos (CEIA). Recibes resultados de 6 instrumentos (CHAEA, DIA Socioemocional, Motivación, Autoeficacia, Clima, etc.) y generas un reporte clínico-pedagógico para el profesor jefe." 
        },
        { 
          role: "user", 
          content: `Genera un REPORTE DE IMPACTO para el estudiante: ${JSON.stringify(studentData)}. 
          Usa estas secciones:
          1. PERFIL DOMINANTE (Resumen narrativo).
          2. FORTALEZAS PSICOSOCIALES.
          3. ÁREAS DE RIESGO O APOYO (Si las hay).
          4. ORIENTACIONES PARA EL DOCENTE (Acciones concretas en aula).
          5. MENSAJE MOTIVACIONAL PARA EL ALUMNO.
          Sé empático, profesional y constructivo. Formatea con Markdown.` 
        }
      ],
      temperature: 0.7,
    });

    console.log('[IA Alumno] ✅ Respuesta recibida exitosamente.');
    return response.choices[0].message.content;
  } catch (error) {
    console.error("[IA Alumno] ❌ Error detallado:", error);
    const msg = error?.message || 'Error desconocido';
    if (msg.includes('401') || msg.includes('Incorrect API key')) {
      return "❌ API Key inválida. Verifica que tu llave sea correcta en platform.openai.com";
    }
    if (msg.includes('429') || msg.includes('Rate limit')) {
      return "⏳ Límite de uso alcanzado. Espera unos minutos e intenta de nuevo.";
    }
    if (msg.includes('insufficient_quota')) {
      return "💳 Tu cuenta de OpenAI no tiene créditos. Recarga en platform.openai.com/account/billing";
    }
    return `No se pudo conectar con el servicio de IA. Error: ${msg}`;
  }
};
