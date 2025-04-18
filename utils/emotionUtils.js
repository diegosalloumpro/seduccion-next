// utils/emotionUtils.js

export const triggers = {
    dulce: ["me encantas", "sos hermosa", "te extraño", "me gustás", "te quiero"],
    fria: ["sos rara", "me aburrís", "no me gustás"],
    enojada: ["sos falsa", "dejá de hablar así", "me molestás"],
    celosa: ["estuve con otra", "mi ex", "una amiga"],
    avergonzada: ["estás muy linda", "quiero besarte", "qué harías conmigo", "dormirías conmigo"],
  };
  
  export const detectarEstadoNuevo = (mensajeUsuario) => {
    for (const estado in triggers) {
      if (triggers[estado].some(trigger => mensajeUsuario.toLowerCase().includes(trigger))) {
        return estado;
      }
    }
    return null;
  };