export const resetLocalState = (setMessages, setInput, setPoints, setLastMessage, setEstadoEmocional, saveProgress) => {
    setMessages([]);
    setInput('');
    setPoints(0);
    setLastMessage('');
    setEstadoEmocional('neutro');
    saveProgress(0, '');
  };