'use client';

import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState([]);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    // Test de l'API Backend
    fetch(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/health')
      .then(res => res.json())
      .then(data => {
        setBackendStatus(data);
        console.log('✅ Frontend: Backend accessible', data);
      })
      .catch(err => {
        console.error('❌ Frontend: Backend inaccessible', err);
        setBackendStatus({ error: err.message });
      });

    // Connexion WebSocket
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    const newSocket = io(wsUrl);

    newSocket.on('connect', () => {
      console.log('✅ Frontend: WebSocket connecté');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Frontend: WebSocket déconnecté');
      setConnected(false);
    });

    newSocket.on('connection_success', (data) => {
      console.log('🎉 Frontend: Connexion confirmée', data);
      addEvent('Connection établie', 'success');
    });

    newSocket.on('game_update', (event) => {
      console.log('📡 Frontend: Événement de jeu reçu', event);
      addEvent(`Événement: ${event.type}`, 'game');
    });

    newSocket.on('pong', (data) => {
      addEvent('Pong reçu du serveur', 'ping');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const addEvent = (message, type) => {
    const newEvent = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    };
    setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Garde les 10 derniers
  };

  const sendPing = () => {
    if (socket) {
      socket.emit('ping');
      addEvent('Ping envoyé', 'ping');
    }
  };

  const testBackendEvent = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/test-event`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log('✅ Frontend: Événement test envoyé', data);
      addEvent('Événement test déclenché', 'test');
    } catch (error) {
      console.error('❌ Frontend: Erreur test événement', error);
      addEvent('Erreur test événement', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          🎲 JDR Assistant - Interface Joueurs
        </h1>

        {/* Status des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">📡 WebSocket</h2>
            <div className={`flex items-center gap-2 ${connected ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {connected ? 'Connecté' : 'Déconnecté'}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">🔧 Backend</h2>
            {backendStatus ? (
              <div className={`${backendStatus.error ? 'text-red-400' : 'text-green-400'}`}>
                {backendStatus.error ? 'Erreur' : `✅ ${backendStatus.status}`}
                {backendStatus.redis && (
                  <div className="text-sm mt-1">Redis: {backendStatus.redis}</div>
                )}
              </div>
            ) : (
              <div className="text-yellow-400">Vérification...</div>
            )}
          </div>
        </div>

        {/* Boutons de test */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={sendPing}
            disabled={!connected}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded-lg"
          >
            🏓 Test Ping
          </button>
          <button
            onClick={testBackendEvent}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
          >
            📤 Test Événement
          </button>
        </div>

        {/* Log des événements */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📝 Événements Temps Réel</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <div className="text-gray-400 text-center py-4">
                Aucun événement reçu...
              </div>
            ) : (
              events.map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 bg-gray-700 rounded">
                  <span className={`
                    ${event.type === 'success' ? 'text-green-400' : ''}
                    ${event.type === 'error' ? 'text-red-400' : ''}
                    ${event.type === 'game' ? 'text-blue-400' : ''}
                    ${event.type === 'ping' ? 'text-yellow-400' : ''}
                    ${event.type === 'test' ? 'text-purple-400' : ''}
                  `}>
                    {event.message}
                  </span>
                  <span className="text-gray-400 text-sm">{event.timestamp}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-900 rounded-lg">
          <h3 className="font-semibold mb-2">🧪 Tests à effectuer :</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Vérifier que WebSocket est connecté (point vert)</li>
            <li>Vérifier que Backend est accessible</li>
            <li>Tester le ping/pong WebSocket</li>
            <li>Tester la publication d'événements</li>
            <li>Depuis la console MJ, utiliser les commandes test-scene et test-combat</li>
          </ul>
        </div>
      </div>
    </div>
  );
}