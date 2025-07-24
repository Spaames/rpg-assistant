const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const redis = require('redis');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Connexion Redis
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = redis.createClient({ url: redisUrl });
const redisSubscriber = redis.createClient({ url: redisUrl });

// Test de connexion Redis au démarrage
async function initRedis() {
  try {
    await redisClient.connect();
    await redisSubscriber.connect();
    console.log('✅ Backend: Connexion Redis OK');
    
    // Test d'écriture
    await redisClient.set('backend:status', JSON.stringify({
      service: 'backend',
      status: 'online',
      timestamp: new Date().toISOString()
    }));
    console.log('✅ Backend: Écriture Redis OK');
    
    // Écoute des événements Redis
    await redisSubscriber.subscribe('game_updates', (message) => {
      console.log('📡 Backend: Événement Redis reçu:', message);
      
      try {
        const event = JSON.parse(message);
        // Retransmet à tous les clients WebSocket
        io.emit('game_update', event);
        console.log('📤 Backend: Événement envoyé aux clients');
      } catch (error) {
        console.error('❌ Backend: Erreur parsing événement:', error);
      }
    });
    
    console.log('👂 Backend: Écoute des événements Redis activée');
    
  } catch (error) {
    console.error('❌ Backend: Erreur Redis:', error);
  }
}

// Routes de test
app.get('/', (req, res) => {
  res.json({
    message: 'JDR Backend Online',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', async (req, res) => {
  try {
    await redisClient.ping();
    res.json({
      service: 'backend',
      status: 'healthy',
      redis: 'connected',
      websockets: io.engine.clientsCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      service: 'backend',
      status: 'unhealthy',
      redis: 'disconnected',
      error: error.message
    });
  }
});

// Test de publication dans Redis
app.post('/test-event', async (req, res) => {
  try {
    const testEvent = {
      type: 'test_event',
      data: { message: 'Test depuis le backend' },
      timestamp: new Date().toISOString()
    };
    
    await redisClient.publish('game_updates', JSON.stringify(testEvent));
    
    res.json({
      message: 'Événement test publié',
      event: testEvent
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
  console.log(`🔌 Backend: Client connecté (${socket.id})`);
  
  // Message de bienvenue
  socket.emit('connection_success', {
    message: 'Connexion WebSocket réussie',
    timestamp: new Date().toISOString()
  });
  
  socket.on('disconnect', () => {
    console.log(`🔌 Backend: Client déconnecté (${socket.id})`);
  });
  
  // Test ping/pong
  socket.on('ping', () => {
    socket.emit('pong', { timestamp: new Date().toISOString() });
  });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Backend: Serveur démarré sur le port ${PORT}`);
  initRedis();
});

// Gestion propre de l'arrêt
process.on('SIGTERM', async () => {
  console.log('🛑 Backend: Arrêt en cours...');
  await redisClient.disconnect();
  await redisSubscriber.disconnect();
  server.close();
});