import React, { useEffect, useState } from 'react';
import './MeldingerComponent.css'; 

function MeldingerComponent() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Message fetching logic should be here
    const simulateIncomingMessage = () => {
      const newMessage = {
        id: messages.length,
        timestamp: new Date().toLocaleString(),
        content: `New message from admin with ID ${messages.length}, just for testing.`,
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    // Create a new message every 5 seconds
    const messageInterval = setInterval(simulateIncomingMessage, 5000);

    return () => clearInterval(messageInterval);
  }, [messages]); 


  return (
    <div className="meldinger-content">
      {messages.map(message => (
        <div key={message.id} className="message-card">
          <div className="message-timestamp">{message.timestamp}</div>
          <div className="message-text">{message.content}</div>
        </div>
      ))}
    </div>
  );
}

export default MeldingerComponent;
