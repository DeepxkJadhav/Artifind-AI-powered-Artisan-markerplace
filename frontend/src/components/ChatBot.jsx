import React, { useState, useRef, useEffect } from 'react';
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI assistant for Artifind. I can help you find artisan products, learn about crafting techniques, or connect you with local makers. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'Show me pottery',
    'Find local artisans',
    'What materials are popular?',
    'Help with product search',
  ];

  const generateBotResponse = (userMessage) => {
    const responses = {
      'pottery': 'I found several amazing pottery pieces! Our artisans specialize in traditional ceramic work, modern designs, and functional pottery. Would you like to see specific categories like bowls, vases, or decorative pieces?',
      'artisan': 'We have talented local artisans in your area! I can show you potters, woodworkers, textile artists, and jewelry makers. What type of craft interests you most?',
      'material': 'Popular materials right now include reclaimed wood, hand-thrown clay, organic cotton, recycled metals, and natural stone. Many artisans are focusing on sustainable and eco-friendly materials.',
      'search': 'I can help you search using AI-powered features! Try describing what you\'re looking for, upload an image for visual search, or use voice search. You can also filter by location, price, or craft type.',
      'default': 'That\'s interesting! I can help you discover amazing handcrafted items and connect with talented artisans. Try asking about specific crafts, materials, or let me know what kind of unique piece you\'re looking for!',
    };

    const lowerMessage = userMessage.toLowerCase();
    for (const key in responses) {
      if (lowerMessage.includes(key)) {
        return responses[key];
      }
    }
    return responses.default;
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      const userMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage('');
      setIsTyping(true);

      // Simulate AI thinking time
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: generateBotResponse(inputMessage),
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
        onClick={() => setOpen(true)}
      >
        <ChatIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '600px',
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <BotIcon color="primary" />
          <Typography variant="h6">Artifind AI Assistant</Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
          <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, maxWidth: '80%' }}>
                  {message.sender === 'bot' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      <BotIcon fontSize="small" />
                    </Avatar>
                  )}
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                      color: message.sender === 'user' ? 'white' : 'black',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
                  </Paper>
                  {message.sender === 'user' && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}
            
            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  <BotIcon fontSize="small" />
                </Avatar>
                <Paper elevation={1} sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 2 }}>
                  <Typography variant="body2" color="textSecondary">
                    AI is typing...
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Quick Reply Buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {quickReplies.map((reply, index) => (
              <Chip
                key={index}
                label={reply}
                variant="outlined"
                size="small"
                onClick={() => handleQuickReply(reply)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask me about artisan products..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSendMessage} color="primary">
                  <SendIcon />
                </IconButton>
              ),
            }}
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatBot;