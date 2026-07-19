# 🎮 Multiplayer Quiz Game

A real-time multiplayer quiz game built with the MERN stack where players can create rooms, invite friends, and compete in exciting quiz challenges together.

## ✨ Features

- 🏠 **Room-based Multiplayer** - Create private game rooms and invite friends
- ⚡ **Real-time Gameplay** - Live quiz sessions with instant score updates
- 🤖 **AI-Powered Questions** - Dynamic quiz generation using Google's Gemini AI
- 🔐 **Secure Authentication** - JWT-based user authentication
- 👥 **Multiplayer Support** - Play with multiple friends simultaneously

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Redis**   - Cache and state management
- **JWT** - Authentication

### APIs
- **Google Gemini AI** - Question generation

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v20 or higher)
- npm or yarn
- MongoDB (local or Atlas account)
- Redis Cache

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RazimRafi8910/Quess-game_Mern-application.git
   cd Quess-game_Mern-application
   ```

2. **Install client dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd ../server
   npm install
   ```

### Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# JWT Secret Key
JWT_KEY=your_jwt_secret_key

# Google Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key
```

**Where to get the API keys:**
- **MongoDB URI**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Create a free cluster
- **Gemini API Key**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **JWT Key**: Generate a random secure string (e.g., using `openssl rand -base64 32`)

## 💻 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:3001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📁 Project Structure

```
quiz-game/
├── client/                 # Frontend React application
│   ├── src/
|   |   ├── assets/        # Project Assests
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
|   |   ├── Hooks/         # Custom hooks
|   |   ├── utils/         # Uitility functions
|   |   ├── App.tsx
│   │   └── main.tsx
│   │   └── types.ts
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── controllers/      # Route controllers
│   ├── game/             # Game related Classes
│   ├── middleware/       # Middlewares
│   ├── services/         # Services
│   ├── socket/           # Socket controllers
│   ├── test/             # Test functions
│   ├── utils/            # Uitility functions
│   ├── index.js
│   └── package.json
│
└── README.md
```

## 🎯 How to Play

1. **Sign Up / Login** - Create an account or login
2. **Create a Room** - Start a new game room
3. **Invite Friends** - Share the room code with friends
4. **Start Quiz** - Begin the quiz when all players are ready
5. **Answer Questions** - Race against time and competitors
6. **View Results** - Check the leaderboard after the game

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Razim Rafi**
- GitHub: [@RazimRafi8910](https://github.com/RazimRafi8910)

## 🐛 Known Issues

- None currently reported

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Made with ❤️ by Razim Rafi