from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI(title="RPG AI Test")

@app.get("/")
async def root():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>🎲 RPG AI Python</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 40px;
                border-radius: 20px;
                backdrop-filter: blur(10px);
                max-width: 600px;
                margin: 0 auto;
            }
            h1 { font-size: 3em; margin-bottom: 20px; }
            p { font-size: 1.2em; margin: 10px 0; }
            .status { 
                background: #4CAF50; 
                padding: 10px 20px; 
                border-radius: 25px; 
                display: inline-block;
                margin: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🎲 RPG AI Python - TEST PAGE</h1>
            <p>📡 Port: 8000</p>
            <p>🔗 <a href="/docs" style="color: #FFD700;">Documentation API</a></p>
        </div>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)

@app.get("/health")
async def health():
    return {"status": "OK", "message": "Python AI service is running"}

@app.get("/test")
async def test():
    return {"message": "🎮 Test réussi ! L'IA RPG est prête."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)