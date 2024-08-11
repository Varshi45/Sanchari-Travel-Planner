# Sanchari

Sanchari is a React Native travel planning application that helps users plan their trips by providing personalized itineraries, accommodation options, activities, and tips. The app integrates with various APIs and Firebase services to offer a seamless user experience.

## Features

- **User Authentication**: Secure sign-in and sign-out using Firebase Authentication.
- **User Profile Management**: Users can view and update their profile, including uploading a profile picture.
- **Favorites Management**: Users can add trips to their favorites and view them in their profile.
- **Personalized Trip Planning**: The app provides users with personalized trip itineraries based on their preferences.
- **Dynamic Content**: Fetches and displays dynamic content from external APIs (e.g., weather, locations).
- **Responsive Design**: Tailwind CSS is used for styling, providing a responsive and modern UI.
- **Animations**: Smooth animations for profile expansion and trip detail viewing.

## Screenshots

![Profile Screen](./screenshots/profile_screen.png)
![Favorites Screen](./screenshots/favorites_screen.png)

## Installation

### Prerequisites

- Node.js (v14.x or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Firebase Project (configured with Authentication and Firestore)

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/varshi45/sanchari-travel-planner.git
   cd sanchari-travel-planner
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Firebase**:

   - Create a Firebase project in the Firebase Console.
   - Enable Email/Password authentication.
   - Configure Firestore to store user data and trips.
   - Add your Firebase configuration to a `.env` file:

   ```bash
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-auth-domain
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

4. **Start the Development Server**:

   ```bash
   expo start
   ```

5. **Run on a Simulator or Physical Device**:

   - Use the Expo Go app to run the project on your mobile device.
   - Or run it on an Android/iOS simulator.

## Project Structure

The project is organized as follows:

```plaintext
sanchari/
│
├── assets/                # Project assets (images, icons, etc.)
├── app/
│   ├── (auth)             # Authentication
|   ├── (tabs)             # App screens 
│   ├── index.js           # Main root component
│   └── explore.js         # Other components
├── context/               # Global context for state management
│   └── GlobalProvider.js  # Global context provider
├── lib/                   # Firebase and API utility functions
│   ├── firebase.js        # Firebase functions (auth, Firestore, etc.)
│   └── gemini.js          # Other utilities
├── components/            # Reusable components
│   ├── WeatherInfo.js     # Profile screen component
│   └── ...                # Other screens
├── tailwind.config.js     # Tailwind CSS configuration
├── .env                   # Environment variables
├── package.json           # Project metadata and scripts
└── README.md              # Project documentation
```

## Usage

### User Authentication

- Users can sign in or sign up using their email and password.
- After signing in, users can access their profile and manage their account.

### Profile Management

- Users can update their profile picture by clicking the camera icon on the profile screen.
- The profile screen displays the user's name, email, and profile picture.
- A loading animation is shown while the image is being uploaded.

### Favorite Trips

- Users can add trips to their favorites, and view them in the "Favorites" section.
- Favorite trips are displayed with their details, including accommodation options, activities, and tips.

## Technologies Used

- **React Native**: For building the mobile app.
- **Expo**: For development and testing on multiple devices.
- **Firebase**: For user authentication, Firestore database, and storage.
- **Tailwind CSS**: For responsive and modern UI styling.
- **React Native Animations**: For smooth UI transitions and effects.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any feature additions or bug fixes.

## Contact

For any inquiries or support, please reach out to [mail](mailto:tejvarshith45@gmail.com).
