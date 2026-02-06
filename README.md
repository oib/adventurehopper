# AdventureHopper 🎮

A web-based collection game inspired by the "2 Cars" concept. Control six squares to collect adventure-themed emojis moving across roads!

## 🎯 Game Features

- **42 Unique Adventures**: Collect different adventure emojis categorized into Places & Nature, Transport, and Wildlife
- **Progressive Difficulty**: Game gets harder over 60 seconds with increasing speed and spawn rates
- **2-Minute Challenges**: Quick, exciting gameplay sessions
- **Collection Tracking**: Keep track of your unique discoveries
- **Smooth Animations**: Built with modern web technologies for optimal performance

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip

### Installation

1. Clone the repository
```bash
git clone https://github.com/oib/adventurehopper.git
cd adventurehopper
```

2. Create and activate virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Run the game
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. Open your browser and navigate to `http://localhost:8000`

## 🎮 How to Play

1. Click **🎮 Start Game** to begin
2. Click on the blue pipes to move orange squares up or down
3. Collect adventure emojis as they pass by
4. Try to collect all 42 unique adventures before time runs out!
5. The game gets progressively harder - speed increases and more obstacles appear

## 🏗️ Project Structure

```
adventurehopper/
├── main.py              # FastAPI server and API endpoints
├── requirements.txt     # Python dependencies
├── static/             # Frontend assets
│   ├── index.html      # Main game HTML
│   ├── style.css       # Game styling and animations
│   ├── config.js       # Game configuration constants
│   └── app.js          # Main game logic
└── docs/               # Documentation
    └── game-programming-documentation.md
```

## 🛠️ Technologies Used

- **Backend**: Python with FastAPI
- **Frontend**: Vanilla JavaScript (ES6 Modules)
- **Styling**: CSS3 with CSS Variables
- **Animation**: Web Animations API
- **Server**: Uvicorn ASGI

## 📚 Documentation

For detailed technical documentation about how the game is programmed, see [game-programming-documentation.md](docs/game-programming-documentation.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Score persistence with database
- [ ] User profiles and statistics
- [ ] Achievement system
- [ ] Sound effects and music
- [ ] Mobile touch support
- [ ] Pause functionality
- [ ] Multiplayer mode

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎨 Game Controls

| Action | Control |
|--------|---------|
| Move Square Up/Down | Click on corresponding pipe |
| Start Game | Click 🎮 Start Game button |
| Reset Game | Click 🔄 Reset Game during play |

Happy adventuring! 🌟
