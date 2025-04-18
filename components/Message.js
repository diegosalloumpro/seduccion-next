import React from 'react';

const Message = ({ sender, text, mood }) => {
  const isUser = sender === 'user';

  const getStyle = () => {
    if (isUser) {
      return {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
        color: '#000',
      };
    }

    let background = '#eee';
    let color = '#000';

    if (mood === 'dulce') {
      background = '#ffe6f0';
      color = '#d63384';
    } else if (mood === 'fría') {
      background = '#e0f0ff';
      color = '#007bff';
    } else if (mood === 'celosa') {
      background = '#fff3cd';
      color = '#856404';
    } else {
      background = '#f1f0f0';
      color = '#333';
    }

    return {
      alignSelf: 'flex-start',
      backgroundColor: background,
      color: color,
    };
  };

  return (
    <div style={{ 
      ...styles.message, 
      ...getStyle() 
    }}>
      <span><strong>{isUser ? 'Vos' : 'Ella'}:</strong> {text}</span>
    </div>
  );
};

const styles = {
  message: {
    maxWidth: '80%',
    padding: '10px',
    margin: '5px 0',
    borderRadius: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
};

export default Message;
