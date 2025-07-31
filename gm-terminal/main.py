import redis
import json
import os
import glob
from datetime import datetime
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt
from rich.table import Table

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

def list_and_select_scene():
    """Liste les fichiers PNG dans ../data/scenes et permet de sélectionner"""
    scenes_path = "../data/scenes"
    
    try:
        # Recherche des fichiers PNG
        png_files = glob.glob(os.path.join(scenes_path, "*.png"))
        
        if not png_files:
            console.print(f"❌ Aucun fichier PNG trouvé dans {scenes_path}", style="red")
            return None
        
        # Création d'un tableau pour afficher les fichiers
        table = Table(title="🖼️ Scènes disponibles")
        table.add_column("N°", style="cyan", no_wrap=True)
        table.add_column("Fichier", style="magenta")
        table.add_column("Taille", style="green")
        
        for i, file_path in enumerate(png_files, 1):
            filename = os.path.basename(file_path)
            try:
                size = os.path.getsize(file_path)
                size_str = f"{size / 1024:.1f} KB"
            except:
                size_str = "N/A"
            table.add_row(str(i), filename, size_str)
        
        console.print(table)
        
        # Demande de sélection
        try:
            choice = Prompt.ask(
                f"Choisissez une scène (1-{len(png_files)}) ou 'q' pour annuler",
                default="q"
            )
            
            if choice.lower() == 'q':
                return None
                
            choice_num = int(choice)
            if 1 <= choice_num <= len(png_files):
                selected_file = os.path.basename(png_files[choice_num - 1])
                console.print(f"✅ Scène sélectionnée: {selected_file}", style="green")
                return selected_file
            else:
                console.print("❌ Choix invalide", style="red")
                return None
                
        except ValueError:
            console.print("❌ Veuillez entrer un numéro valide", style="red")
            return None
            
    except Exception as e:
        console.print(f"❌ Erreur lors de la lecture des fichiers: {e}", style="red")
        return None

def interactive_test(redis_client):
    """Interface de test interactive"""
    console.print(Panel.fit("🎲 Console MJ - Mode Test", style="bold blue"))
    
    while True:
        console.print("\n[bold]Commandes disponibles:[/bold]")
        console.print("1. test-scene - Lister et sélectionner une scène à publier")
        console.print("2. test-combat - Publier début de combat")
        console.print("3. status - Voir l'état Redis")
        console.print("4. quit - Quitter")
        
        cmd = Prompt.ask("Commande")
        
        if cmd == "quit":
            break
        elif cmd == "test-scene":
            selected_scene = list_and_select_scene()
            if selected_scene:
                event = {
                    "scene": selected_scene,
                    "timestamp": datetime.now().isoformat()
                }
                redis_client.publish("game:current_scene", json.dumps(event))
                redis_client.set("game:current_scene", json.dumps(event))
                console.print(f"📸 Scène publiée: {selected_scene}", style="cyan")
            else:
                console.print("❌ Aucune scène sélectionnée", style="yellow")
            
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