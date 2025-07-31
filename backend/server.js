import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", //next.js frontend
    methods: ["GET", "POST"]
  }
});

// Redis sub setup
const redisSubscriber = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

// Connect to Redis and setup subscription
async function initRedis() {
  try {
    await redisSubscriber.connect();
    console.log('✅ Redis connected');
    
    await redisSubscriber.subscribe('game:current_scene', (message) => {
      console.log('Backend : current_scene event received:', message);
      try {
        const event = JSON.parse(message);
        //Give the event to all clients
        io.emit('current_scene', event);
        console.log('Backend : current_scene event sent to clients: ' + JSON.stringify(event));
      } catch (error) {
        console.error('❌ Backend: Erreur parsing current_scene event:', error);
      }
    });
    
    console.log('👂 Subscribed to current_scene channel');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
  }
}

io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

httpServer.listen(3001, () => {
  console.log('🚀 Server running on http://localhost:3001');
  initRedis();
});
