# BillBeam

**AI-Powered Bill Splitting Application**

BillBeam is a modern web application that uses AI to scan receipts and intelligently split bills among friends. Simply snap a photo of your receipt, add your friends, and let the app handle the math.

## Features

- **AI Receipt Scanning** - Powered by Google Gemini AI to extract items, prices, tax, and tip
- **Smart Assignment** - Assign items to multiple people with an intuitive interface
- **Automatic Calculation** - Handles tax, tip, and discounts automatically
- **Google Authentication** - Secure sign-in with Google
- **Receipt History** - Save and manage past receipts
- **Saved Groups** - Create and reuse friend groups for recurring splits
- **Mobile-First Design** - Optimized for mobile devices with haptic feedback
- **Beautiful UI** - Modern design with Tailwind CSS and Framer Motion animations

## Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**:  Vite
- **Styling**:  Tailwind CSS with custom animations
- **AI Integration**: Google Gemini 2.0 Flash
- **Backend**: Firebase (Authentication + Firestore)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

Before you begin, ensure you have: 

- Node.js (v18 or higher)
- npm or yarn
- A Google account (for Firebase)
- Google Gemini API key
- Firebase project with Authentication and Firestore enabled

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/arthik444/preSplit.git
cd preSplit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Configure Firebase

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase setup instructions.

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

1. **Sign In** - Authenticate with your Google account
2. **Scan Receipt** - Take a photo or upload an image of your receipt
3. **Review Items** - AI extracts items automatically (edit if needed)
4. **Add Friends** - Add people you're splitting with
5. **Assign Items** - Tap items to assign them to people
6. **View Settlement** - See who owes what, including tax and tip calculations
7. **Save Receipt** - Optionally save for future reference

## Firebase Setup

This application requires Firebase for:

- **Authentication** (Google Sign-In)
- **Firestore Database** (Storing receipts, groups, and preferences)

Key Firestore collections:
- `receipts` - Saved receipt history
- `groups` - Saved friend groups
- `userPreferences` - User settings and default groups

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete setup instructions.

## AI Integration

BillBeam uses **Google Gemini 2.0 Flash** for receipt parsing:

- Validates that uploaded images are actual receipts
- Extracts line items with descriptions and prices
- Identifies discounts and applies them correctly
- Parses subtotal, tax, tip, and total amounts
- Handles various receipt formats and layouts

## Project Structure

```
preSplit/
├── src/
│   ├── components/        # React components
│   │   ├── CapturePhase.tsx
│   │   ├── AssignmentPhase.tsx
│   │   ├── SettlementPhase.tsx
│   │   └── ... 
│   ├── services/          # External service integrations
│   │   ├── auth. ts        # Firebase authentication
│   │   ├── firestore. ts   # Firestore operations
│   │   └── gemini.ts      # Gemini AI integration
│   ├── config/            # Configuration files
│   │   └── firebase.ts    # Firebase config
│   ├── hooks/             # Custom React hooks
│   │   └── useHaptic.ts   # Haptic feedback
│   ├── types.ts           # TypeScript type definitions
│   ├── store.tsx          # Global state management
│   ├── App. tsx            # Main app component
│   └── main.tsx           # Entry point
├── public/                # Static assets
├── firebase. json          # Firebase configuration
├── firestore.rules        # Firestore security rules
└── package. json           # Dependencies
```

## Key Features Explained

### Receipt Parsing

The AI service (`src/services/gemini.ts`) processes receipt images and:
- Validates receipt authenticity
- Extracts structured data
- Handles discounts and special pricing
- Returns JSON-formatted receipt data

### State Management

Uses React Context (`src/store.tsx`) for:
- App phase navigation (capture → assignment → settlement)
- Receipt and people data
- Authentication state
- Receipt history and saved groups
- Local storage persistence

### Three-Phase Flow

1. **Capture Phase** - Scan/upload receipt
2. **Assignment Phase** - Assign items to people
3. **Settlement Phase** - Calculate and display who owes what

## Testing

Test files are included:
- `test-api.js` - API integration tests
- `test-discount.js` - Discount calculation tests

```bash
node test-api.js
node test-discount. js
```

## Deployment

The application is configured for Firebase Hosting: 

```bash
npm run build
firebase deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License. 

## Authors

**arthik444**

- GitHub: [@arthik444](https://github.com/arthik444)

**gana36**

- GitHub: [@gana36](https://github.com/gana36)

## Acknowledgments

- Google Gemini AI for receipt parsing
- Firebase for backend infrastructure
- The React and Vite communities

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/arthik444/preSplit/issues) on GitHub.

---

Built with React, TypeScript, and AI
