import redis
import json
import os
from datetime import datetime
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

# Console Rich pour un affichage coloré
console = Console()

# Connexion Redis
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

def test_redis_connection():
    """Test la connexion Redis"""
    try:
        redis_client = redis.from_url(redis_url, decode_responses=True)
        redis_client.ping()
        console.print("✅ Console MJ: Connexion Redis OK", style="green")
        return redis_client
    except Exception as e:
        console.print(f"❌ Console MJ: Erreur Redis - {e}", style="red")
        return None

def test_write_data(redis_client):
    """Test d'écriture de données dans Redis"""
    try:
        # Test de données de jeu
        game_state = {
            "current_scene": "tavern.jpg",
            "game_phase": "exploration",
            "timestamp": datetime.now().isoformat()
        }
        
        redis_client.set("game:state", json.dumps(game_state))
        console.print("✅ Console MJ: Écriture données de jeu OK", style="green")
        
        # Test de publication d'événement
        event = {
            "type": "scene_changed",
            "data": {"scene": "tavern.jpg"},
            "timestamp": datetime.now().isoformat()
        }
        
        redis_client.publish("game_updates", json.dumps(event))
        console.print("✅ Console MJ: Publication événement OK", style="green")
        
    except Exception as e:
        console.print(f"❌ Console MJ: Erreur écriture - {e}", style="red")

def interactive_test(redis_client):
    """Interface de test interactive"""
    console.print(Panel.fit("🎲 Console MJ - Mode Test", style="bold blue"))
    
    while True:
        console.print("\n[bold]Commandes disponibles:[/bold]")
        console.print("1. test-scene - Publier changement de scène")
        console.print("2. test-combat - Publier début de combat")
        console.print("3. status - Voir l'état Redis")
        console.print("4. quit - Quitter")
        
        cmd = Prompt.ask("Commande")
        
        if cmd == "quit":
            break
        elif cmd == "test-scene":
            event = {
                "type": "scene_changed",
                "data": {"scene": "forest.jpg"},
                "timestamp": datetime.now().isoformat()
            }
            redis_client.publish("game_updates", json.dumps(event))
            console.print("📸 Scène publiée: forest.jpg", style="cyan")
            
        elif cmd == "test-combat":
            event = {
                "type": "combat_started",
                "data": {"initiative": ["player_1", "goblin_1", "player_2"]},
                "timestamp": datetime.now().isoformat()
            }
            redis_client.publish("game_updates", json.dumps(event))
            console.print("⚔️ Combat publié", style="red")
            
        elif cmd == "status":
            try:
                keys = redis_client.keys("*")
                console.print(f"🔑 Clés Redis: {len(keys)}")
                for key in keys[:5]:  # Affiche les 5 premières
                    value = redis_client.get(key)
                    console.print(f"  {key}: {value[:50]}...")
            except Exception as e:
                console.print(f"❌ Erreur status: {e}", style="red")

def main():
    console.print(Panel.fit("🎲 JDR Assistant - Console MJ", style="bold green"))
    
    # Test connexion
    redis_client = test_redis_connection()
    if not redis_client:
        return
    
    # Test écriture
    test_write_data(redis_client)
    
    # Mode interactif
    interactive_test(redis_client)
    
    console.print("👋 Console MJ fermée", style="yellow")

if __name__ == "__main__":
    main()