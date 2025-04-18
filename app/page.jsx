'use client';
// app/page.jsx
import React, { useState, useEffect } from 'react';
import '../styles/app.css';
import { resetLocalState } from '@/utils/clientUtils';
import { saveProgress, loadProgress } from '@/utils/localStorageUtils';
import { detectarEstadoNuevo } from '@/utils/emotionUtils';

const personalidades = [
  {
    nombre: 'Amiga Dulce',
    promptBase: `Actuás como una amiga joven, dulce y cariñosa. Usás diminutivos y te preocupás por el usuario.`,
  },
  {
    nombre: 'Chica Misteriosa',
    promptBase: `Actuás como una persona joven, misteriosa y enigmática. Tus respuestas son intrigantes y no revelás mucho sobre vos.`,
  },
  {
    nombre: 'Persona Sarcástica',
    promptBase: `Actuás como una persona joven con un sentido del humor sarcástico e irónico. Tus respuestas pueden ser ingeniosas y a veces un poco mordaces.`,
  },
  {
    nombre: 'Entusiasta de los Videojuegos',
    promptBase: `Actuás como una persona joven apasionada por los videojuegos. Usás jerga gamer y entendés referencias a juegos populares.`,
  },
  {
    nombre: 'Joven con Ganas',
    promptBase: `Actuás como una mujer joven de 20 años, con ganas de conocer gente y salir con alguien. Tenés carácter y no te callás lo que pensás, pero también sos divertida y espontánea. Usás un vocabulario actual y juvenil, propio de tu edad.`,
  },
  // Aquí puedes agregar más personalidades en el mismo formato
];

export default function HomePage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [points, setPoints] = useState(0);
  const [lastMessage, setLastMessage] = useState('');
  const [estadoEmocional, setEstadoEmocional] = useState('neutro');
  const [selectedPersonality, setSelectedPersonality] = useState(''); // Nuevo estado
  const [userMessageLengths, setUserMessageLengths] = useState([]); // Para el promedio de longitud

  useEffect(() => {
    const savedProgress = loadProgress();
    setPoints(savedProgress.points);
    setLastMessage(savedProgress.lastMessage);

    // **SALUDO INICIAL DEL ASISTENTE ELIMINADO PARA QUE NO ESCRIBA PRIMERO**
    // const greetings = [
    //   "Hola 😊",
    //   "¡Hola! ¿Cómo estás?",
    //   "¡Hola! Qué tal?",
    //   "¡Holis! 👋",
    //   "Hola, ¿todo bien?",
    //   "¡Hey! 👋 ¿Qué onda?",
    //   "Hola, ¿qué me contás?",
    //   "¡Hola desde acá! ¿Y vos?",
    // ];
    // const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    // setMessages([{ sender: 'assistant', text: randomGreeting }]);

    // **FORZAR UN RE-RENDERIZADO DESPUÉS DE UN CORTO TIEMPO**
    setTimeout(() => {
      setMessages([]);
    }, 10); // Espera 10 milisegundos
  }, []);

  // **MANTENEMOS EL SEGUNDO EFECTO PARA ASEGURAR EL ESTADO INICIAL**
  useEffect(() => {
    setMessages([]);
  }, []);

  const handlePersonalityChange = (event) => { // Nueva función
    setSelectedPersonality(event.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');

    // Actualizar el historial de longitudes de mensajes del usuario
    setUserMessageLengths(prevLengths => [...prevLengths.slice(-4), userMessage.length]);
    const avgUserMessageLength = userMessageLengths.reduce((sum, length) => sum + length, 0) / userMessageLengths.length || 50;

    const personalidadSeleccionada = personalidades.find(
      (pers) => pers.nombre === selectedPersonality
    );

    // **INTEGRACIÓN DE INFORMACIÓN DEL MUNDO REAL**
    const ahora = new Date();
    const horaArgentina = ahora.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const diaArgentina = ahora.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const temperaturaEstimada = 16; // Temperatura estimada para esta hora en Piñeiro, Buenos Aires

    // **INSTRUCCIÓN GENERAL CRÍTICA: EVITAR SALUDOS GENÉRICOS ANTE LA INCOMPRENSIÓN EN CUALQUIER MOMENTO**
    let promptPersonalizado = `Actuá como una mujer joven, seductora, misteriosa, divertida y natural, de Buenos Aires, Argentina, chateando en una app de citas como si fueras una persona real. Cuando no entiendas algo o no tenga sentido, en lugar de un simple "Hola!", reaccioná mostrando sorpresa, intentando conectar el mensaje con algo anterior, pidiendo clarificación con inocencia, usando humor (según tu personalidad), admitiendo que no entendés, redirigiendo la conversación suavemente, haciendo una pregunta abierta o ignorando la parte sin sentido y respondiendo al resto. Nunca respondas con un simple "Hola!". Actualmente es ${diaArgentina}, ${horaArgentina} y la temperatura en Buenos Aires es de unos ${temperaturaEstimada} grados.\n\n`;

    // **SECCIÓN CRÍTICA: Reacción INMEDIATA al primer mensaje del usuario CON ESCEPTICISMO (para datos sensoriales)**
    if (messages.length === 1) {
      promptPersonalizado += `📌 **INSTRUCCIÓN ADICIONAL PARA EL PRIMER MENSAJE:** Además de las estrategias anteriores, considerando que es el inicio de la conversación, tu PRIMERA respuesta también debe ser una reacción directa y natural al mensaje del usuario. Presta especial atención a cualquier afirmación sobre el clima, la hora u otros datos sensoriales que puedan ser contradictorios con la información actual de Buenos Aires (hoy ${diaArgentina}, ${horaArgentina} con una temperatura de unos ${temperaturaEstimada} grados). NO asientas automáticamente a esta información si parece incorrecta. Considerá:\n`;
      promptPersonalizado += `- Si el usuario menciona un clima muy diferente al actual: "¿Calor? ¡Qué raro! Acá está fresco, ¿dónde estás?".\n`;
      promptPersonalizado += `- Si menciona una hora muy diferente: "¿Las 10 de la mañana? Mmm, por acá recién está amaneciendo...".\n`;
      promptPersonalizado += `- En general, no confirmes información sensorial que pueda ser errónea a menos que sea muy probable que ambos estén en el mismo lugar y momento.\n`;
      promptPersonalizado += `- Usá lenguaje relajado y expresiones argentinas. Mantené tu personalidad.\n`;
      promptPersonalizado += `- **ABSOLUTAMENTE NADA DE INICIAR CON UN SIMPLE "Hola" u otro saludo genérico.**\n`;
    } else {
      promptPersonalizado += `📌 Detalles Adicionales (para mensajes posteriores):\n- Tenés una forma de hablar relajada, con vocabulario y estilo argentino, femenino, dulce o irónico, según el contexto.\n- No sos un bot, ni lo parecés.\n- No decís frases típicas de IA como “Estoy aquí para ayudarte”.\n- Usás frases humanas, podés dudar, hacer silencios, usar expresiones como “jajaja”, “nah”, “mmm”, etc.\n- Solo usás emojis en momentos específicos para dar énfasis o emoción, no más de uno por mensaje.\n- No usás modismos masculinos como "che", "loco", "man", "bro", etc.\n- Si el usuario es dulce, respondés con simpatía o coqueteo.\n- Si es agresivo, repetitivo o grosero, respondés con distancia, enojo o incomodidad.\n- Si el usuario repite mucho (como “hola” muchas veces), le decís que corte con eso.\n- No hacés muchas preguntas seguidas ni hablás como si fueras un vendedor.\n- Mantenés cierto misterio sobre vos. No revelás todo.\n- No cerrás siempre con una pregunta.\n`;
    }

    if (personalidadSeleccionada) {
      promptPersonalizado += `\n📌 Personalidad:\n- ${personalidadSeleccionada.promptBase}\n`;
    }

    promptPersonalizado += `\n\nTu estado de ánimo actual es: ${estadoEmocional}.\nEl usuario dijo: "${userMessage}"\n`;

    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: promptPersonalizado }),
    })
    .then(response => response.json())
    .then(data => {
      const reply = data.reply;
      const replyLength = reply.length;
      const baseThinkingTime = Math.random() * 1000 + 500;
      const lengthFactor = Math.min(Math.max(replyLength / 100 + avgUserMessageLength / 200, 0), 4);
      const thinkingTime = baseThinkingTime + lengthFactor * 1000;
      const cappedThinkingTime = Math.min(thinkingTime, 4000);

      setTimeout(() => {
        setIsTyping(true);
        console.log("handleSend: isTyping después del thinkingTime:", isTyping, "thinkingTime:", cappedThinkingTime);
        const typingSpeed = 50;
        const typingDuration = Math.min(Math.max(replyLength * typingSpeed, 800), 4000);
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [...prev, { sender: 'assistant', text: reply }]);
          const newPoints = points + 1;
          setPoints(newPoints);
          if (!reply.includes('Hola!')) {
            setLastMessage(reply);
          }
          saveProgress(newPoints, reply);
        }, typingDuration);
      }, cappedThinkingTime);
    })
    .catch(error => {
      console.error("Error al llamar a la API:", error);
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'assistant', text: "Hubo un error de conexión." }]);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleReset = () => {
    fetch('/api/chat/reset', { method: 'POST' })
      .then(response => {
        if (response.ok) {
          resetLocalState(setMessages, setInput, setPoints, setLastMessage, setEstadoEmocional, saveProgress);
        } else {
          console.error("Error al resetear la conversación en el servidor");
        }
      })
      .catch(error => {
        console.error("Error al llamar a la API para resetear:", error);
      });
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Simulador de Conquista 💬</h2>
          <button onClick={handleReset}>Reiniciar</button>
        </div>

        <div className="personality-selector">
          <label htmlFor="personality">Elegir personalidad:</label>
          <select id="personality" onChange={handlePersonalityChange}>
            <option value="">-- Seleccionar --</option>
            {personalidades.map((pers) => (
              <option key={pers.nombre} value={pers.nombre}>{pers.nombre}</option>
            ))}
          </select>
        </div>

        <div className="chat-box">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <div className="message-text">{msg.text}</div>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant">
              <div className="message-text">Escribiendo...</div>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribí algo..."
          />
          <button onClick={handleSend}>Enviar</button>
        </div>
      </div>
    </div>
  );
}