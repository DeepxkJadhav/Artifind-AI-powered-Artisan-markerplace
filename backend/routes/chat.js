const express = require('express');
const router = express.Router();

// Mock conversation history storage
const conversationHistory = new Map();

// @route   POST /api/chat/message
// @desc    Process chat message and return AI response
// @access  Public
router.post('/message', async (req, res) => {
  try {
    const {
      message,
      sessionId,
      context = {}
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const currentSessionId = sessionId || generateSessionId();
    
    // Get conversation history for this session
    let history = conversationHistory.get(currentSessionId) || [];
    
    // Add user message to history
    const userMessage = {
      id: generateMessageId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    };
    history.push(userMessage);

    // Generate AI response
    const aiResponse = await generateAIResponse(message, history, context);
    
    // Add AI response to history
    const botMessage = {
      id: generateMessageId(),
      role: 'assistant',
      content: aiResponse.content,
      timestamp: new Date().toISOString(),
      suggestions: aiResponse.suggestions || [],
      actions: aiResponse.actions || []
    };
    history.push(botMessage);

    // Update conversation history (limit to last 20 messages)
    conversationHistory.set(currentSessionId, history.slice(-20));

    res.json({
      success: true,
      data: {
        message: botMessage,
        sessionId: currentSessionId,
        conversationLength: history.length
      }
    });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while processing message'
    });
  }
});

// @route   GET /api/chat/history/:sessionId
// @desc    Get conversation history for a session
// @access  Public
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    const history = conversationHistory.get(sessionId) || [];
    const limitedHistory = history.slice(-parseInt(limit));

    res.json({
      success: true,
      data: {
        messages: limitedHistory,
        sessionId,
        totalMessages: history.length
      }
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching chat history'
    });
  }
});

// @route   DELETE /api/chat/session/:sessionId
// @desc    Clear conversation history for a session
// @access  Public
router.delete('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    conversationHistory.delete(sessionId);
    
    res.json({
      success: true,
      message: 'Conversation history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing chat history:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while clearing chat history'
    });
  }
});

// @route   POST /api/chat/voice-to-text
// @desc    Convert voice input to text (placeholder for Google Speech-to-Text)
// @access  Public
router.post('/voice-to-text', async (req, res) => {
  try {
    const { audioData, language = 'en-US' } = req.body;

    if (!audioData) {
      return res.status(400).json({
        success: false,
        error: 'Audio data is required'
      });
    }

    // TODO: Integrate with Google Speech-to-Text API
    // For now, return mock transcription
    const mockTranscription = "Hello, I'm looking for handmade pottery items";

    res.json({
      success: true,
      data: {
        transcription: mockTranscription,
        confidence: 0.94,
        language: language,
        processedAt: new Date().toISOString()
      },
      message: 'Audio transcribed successfully'
    });
  } catch (error) {
    console.error('Error processing voice input:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while processing voice input'
    });
  }
});

// Helper function to generate AI responses
async function generateAIResponse(message, history, context) {
  const lowerMessage = message.toLowerCase();

  // Intent detection and response generation
  if (lowerMessage.includes('pottery') || lowerMessage.includes('ceramic')) {
    return {
      content: "I found some beautiful pottery pieces! Our artisans create handcrafted ceramic bowls, vases, and decorative items. Would you like to see specific types or price ranges?",
      suggestions: ["Show me ceramic bowls", "What pottery is under $100?", "Find local pottery makers"],
      actions: [
        { type: 'search', query: 'pottery ceramic', label: 'Search Pottery' },
        { type: 'filter', category: 'Pottery', label: 'Browse All Pottery' }
      ]
    };
  }

  if (lowerMessage.includes('wood') || lowerMessage.includes('furniture')) {
    return {
      content: "Wonderful! I have wooden crafts including furniture, sculptures, and decorative items. Our artisans specialize in oak, pine, and exotic woods. What catches your interest?",
      suggestions: ["Show me wooden furniture", "Find wooden sculptures", "Custom wood pieces"],
      actions: [
        { type: 'search', query: 'wood furniture', label: 'Search Woodwork' },
        { type: 'filter', category: 'Furniture', label: 'Browse Furniture' }
      ]
    };
  }

  if (lowerMessage.includes('trending') || lowerMessage.includes('popular')) {
    return {
      content: "Currently trending: Eco-friendly bamboo products, hand-woven textiles, and minimalist ceramic designs. Sustainable art is very popular right now!",
      suggestions: ["Show trending items", "Eco-friendly products", "Minimalist designs"],
      actions: [
        { type: 'filter', featured: true, label: 'View Trending' },
        { type: 'search', query: 'eco-friendly sustainable', label: 'Eco Products' }
      ]
    };
  }

  if (lowerMessage.includes('local') || lowerMessage.includes('near')) {
    return {
      content: "I can help you find local artisans! Please share your location, and I'll show you talented creators in your area along with their specialties.",
      suggestions: ["Find artisans in my area", "Show local pottery makers", "Browse by location"],
      actions: [
        { type: 'location', label: 'Share Location' },
        { type: 'browse', path: '/artisans', label: 'Browse Artisans' }
      ]
    };
  }

  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
    return {
      content: "I can help you find items in your budget! Our products range from affordable handmade items under $50 to premium custom pieces. What's your price range?",
      suggestions: ["Under $50", "$50-$200", "$200-$500", "Premium items"],
      actions: [
        { type: 'filter', maxPrice: 50, label: 'Under $50' },
        { type: 'filter', minPrice: 50, maxPrice: 200, label: '$50-$200' }
      ]
    };
  }

  if (lowerMessage.includes('custom') || lowerMessage.includes('commission')) {
    return {
      content: "Many of our artisans accept custom orders! I can connect you with creators who specialize in commissioned work. What type of custom piece are you interested in?",
      suggestions: ["Custom pottery", "Custom furniture", "Custom jewelry", "Contact artisan"],
      actions: [
        { type: 'search', query: 'custom commission', label: 'Custom Work' },
        { type: 'browse', path: '/artisans', label: 'Find Artisans' }
      ]
    };
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
    return {
      content: "Hello! I'm here to help you discover amazing artisan products. I can help you search for specific items, find local creators, get recommendations, or answer questions about our artisans and their work. What interests you today?",
      suggestions: ["Browse pottery", "Find local artisans", "Show trending items", "Help with custom orders"],
      actions: [
        { type: 'browse', path: '/products', label: 'Browse Products' },
        { type: 'browse', path: '/artisans', label: 'Meet Artisans' }
      ]
    };
  }

  if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
    return {
      content: "Shipping varies by artisan and location. Most items ship within 3-7 business days. For custom or made-to-order pieces, delivery times are typically 2-4 weeks. Would you like to know about a specific item?",
      suggestions: ["Shipping costs", "Delivery times", "International shipping", "Rush orders"],
      actions: [
        { type: 'info', topic: 'shipping', label: 'Shipping Info' }
      ]
    };
  }

  // Default response for unmatched queries
  return {
    content: "That's interesting! I can help you find artisan products, learn about crafting techniques, or connect you with local creators. What specific items are you looking for?",
    suggestions: ["Browse all products", "Find artisans", "Search by category", "Get recommendations"],
    actions: [
      { type: 'browse', path: '/products', label: 'Browse Products' },
      { type: 'search', query: '', label: 'Search Products' }
    ]
  };
}

// Helper functions
function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateMessageId() {
  return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

module.exports = router;