# Productivity Bingo - Quest for Achievement

A sophisticated web application that transforms productivity into an epic medieval adventure! Complete bingo boards, earn magical rewards, and level up your productivity with our ADHD-friendly platform.

## Features

### 🏰 Medieval Fantasy Theme
- Beautiful medieval/medieval-themed UI with knight guide and wizard animations
- Encouraging messages and dopamine-rich interactions
- Fantasy fonts and color schemes

### ⚔️ Bingo Board System
- Choose from 3x3, 4x4, or 5x5 bingo boards
- Mix of tolerations (things you've been putting off) and regular tasks
- Free space in the center of each board
- Real-time progress tracking and completion celebrations

### 🧙‍♂️ Interactive Setup Wizard
- Guided wizard to set up your first bingo board
- Collect tolerations, tasks, and rewards through friendly questions
- Wizard character guides you through the process

### 🎯 ADHD/Autism Friendly
- Clear visual feedback and progress indicators
- Dopamine-rich completion celebrations with confetti
- Simple, intuitive interface
- Encouraging messages and positive reinforcement

### 👥 Multi-User Support
- Create accounts with email and password
- Add multiple people to an account
- Each person gets their own bingo boards

### 🎁 Reward System
- Set up custom rewards for completing bingos
- Track progress and achievements
- Email reminders with encouraging quotes

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom medieval theme
- **Animations**: Framer Motion
- **Database**: Prisma with SQLite
- **Authentication**: Custom auth system
- **UI Components**: Headless UI, Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd productivity-bingo
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── BingoBoard.tsx     # Bingo board component
│   ├── KnightGuide.tsx    # Knight guide component
│   └── SetupWizard.tsx    # Setup wizard component
├── prisma/               # Database schema
└── public/               # Static assets
```

## Key Components

### BingoBoard
- Displays the bingo grid with interactive squares
- Handles completion logic and bingo detection
- Shows progress and celebration animations

### SetupWizard
- Multi-step wizard for board creation
- Collects tolerations, tasks, and rewards
- Generates bingo squares automatically

### KnightGuide
- Animated knight character that provides encouragement
- Displays motivational messages
- Adds personality to the interface

## Database Schema

The app uses Prisma with the following main entities:
- **Account**: User accounts with email/password
- **User**: Individual users within an account
- **BingoBoard**: Monthly bingo boards
- **BingoSquare**: Individual squares on boards
- **Reward**: Custom rewards for achievements
- **Toleration**: Things that have been put off
- **Task**: Regular tasks and activities

## Customization

### Adding New Board Sizes
Edit the `SetupWizard` component to add new board size options.

### Modifying Rewards
Update the reward system in the database schema and related components.

### Styling Changes
Modify the Tailwind configuration in `tailwind.config.js` and global styles in `app/globals.css`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub.

---

**Ready to begin your quest for productivity? Start your adventure today! ⚔️🏰**
