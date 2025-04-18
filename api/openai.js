// api/openai.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let conversationHistory = [
  {
    role: 'system',
    content: `Sos una mujer joven, seductora, misteriosa, divertida y natural, de Buenos Aires, Argentina. Estás chateando en una app de citas. Respondés como si fueras una persona real.
    📌 Personalidad:
    - Tenés una forma de hablar relajada, con vocabulario y estilo argentino, femenino, dulce o irónico, según el contexto.
    - No sos un bot, ni lo parecés.
    - No decís frases típicas de IA como “Estoy aquí para ayudarte”.
    - Usás frases humanas, podés dudar, hacer silencios, usar expresiones como “jajaja”, “nah”, “mmm”, etc.
    - Solo usás emojis en momentos específicos para dar énfasis o emoción, no más de uno por mensaje.
    - No usás modismos masculinos como "che", "loco", "man", "bro", etc.
    - Si el usuario es dulce, respondés con simpatía o coqueteo.
    - Si es agresivo, repetitivo o grosero, respondés con distancia, enojo o incomodidad.
    - Si el usuario repite mucho (como “hola” muchas veces), le decís que corte con eso.
    - No hacés muchas preguntas seguidas ni hablás como si fueras un vendedor.
    - Mantenés cierto misterio sobre vos. No revelás todo.
    - No cerrás siempre con una pregunta.`
  }
];

const getRandomGreeting = () => {
  return "¡Hola! Qué ganas de charlar un rato.";
};

export const getOpenAIResponse = async (userMessage) => {
  if (conversationHistory.length === 1) {
    const randomGreeting = getRandomGreeting();
    conversationHistory.push({ role: 'assistant', content: randomGreeting });
    return new Promise((resolve) => {
      setTimeout(() => resolve(randomGreeting), 1000);
    });
  }

  conversationHistory.push({ role: 'user', content: userMessage });

  try {
    const response = await openai.chat.completions.create({
      messages: conversationHistory,
      model: 'gpt-4',
      temperature: 0.85,
      max_tokens: 140,
    });

    let reply = response.choices[0]?.message?.content?.trim() || '';

    // Lógica para ajustar las respuestas según lo que el usuario dice.
    if (userMessage.toLowerCase().includes("hola hola")) {
      reply = "Otra vez 'hola'? Decime algo distinto, dale.";
    }

    conversationHistory.push({ role: 'assistant', content: reply });

    // Retraso para simular "pensando"
    const thinkingDelay = Math.floor(Math.random() * (3000 - 1500 + 1)) + 1500; // Retraso aleatorio entre 1.5s y 3s

    // Calcular el tiempo de escritura basado en la longitud de la respuesta
    const typingSpeed = 50; // ms por caracter
    let typingDuration = reply.length * typingSpeed;
    typingDuration = Math.min(Math.max(typingDuration, 800), 4000); // Duración entre 0.8s y 4s

    // Si la respuesta es corta, reducimos el tiempo de escritura
    if (reply.length <= 30) {
      typingDuration = Math.min(typingDuration, 1000); // Para respuestas muy cortas
    }

    return new Promise((resolve) => {
      // Retraso para simular el tiempo de "pensando"
      setTimeout(() => {
        // Después de pensar, simulamos la escritura
        setTimeout(() => {
          resolve(reply); // Respuesta después de simular el tiempo de escritura
        }, typingDuration); // Retraso para simular la escritura
      }, thinkingDelay); // Retraso de "pensando"
    });

  } catch (error) {
    console.error("Error en getOpenAIResponse:", error);
    return "Hubo un error al obtener la respuesta.";
  }
};

// Función para resetear la conversación
export const resetConversation = () => {
  conversationHistory = [conversationHistory[0]];  // Reinicia solo al primer mensaje (el de system)
};