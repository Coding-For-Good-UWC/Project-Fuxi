# Fuxi Frontend Project - React Native Setup Guide

This guide provides step-by-step instructions for running the Fuxi Frontend Project using React Native.

## 1. Install Node.js Dependencies

Before getting started, ensure you have Node.js and its dependencies installed on your system. You can download Node.js from [nodejs.org](https://nodejs.org/). Once installed, navigate to your project directory in the terminal and run:

```bash
cd frontend
npm install
```

## 2. Install Global Libraries

Install the required global libraries, including specific versions for compatibility:

- Expo CLI (Version 49.0.13):

  ```bash
  npm install -g expo@49.0.13
  ```

- Expo-CLI (Version 6.3.10):

  ```bash
  npm install -g expo-cli@6.3.10
  ```

- EAS CLI (Version 5.4.0):

  ```bash
  npm install -g eas-cli@5.4.0
  ```

Ensure you log in to each library using appropriate credentials. Note that Expo versions 46 and above are required for real-time device testing.

Additionally, you can add the following global libraries to Metro (Version 0.79.1) and Metro Core (Version 0.79.1):

- Metro:

  ```bash
  npm install -g metro@0.79.1
  ```

- Metro Core:

  ```bash
  npm install -g metro-core@0.79.1
  ```

These libraries are essential for managing the JavaScript bundling and building process in React Native.

## 3. Download Expo Go App

To test your React Native application on a physical device, download and install the Expo Go app from either Google Play or the App Store. Sign in to Expo Go using the same credentials used for the global libraries.

## 4. Run the Application

Now, you're ready to run the Fuxi Frontend Project:

1. Open your terminal and navigate to the project directory.

2. Start the development server by running:

   ```bash
   expo start
   ```

3. A QR code will be generated and displayed in your terminal.

4. Use the Expo Go app on your mobile device to scan the QR code from the terminal.

5. The Fuxi Frontend Project will load on your mobile device, enabling real-time development and testing.

## 5. Additional Notes

### 5.1. Customize `apiUrl` in app.config.js

To run the application locally, make sure to customize the `apiUrl` in the `app.config.js` file to match your local environment. This ensures that the frontend communicates with the correct backend server when running locally.

Enjoy developing with the Fuxi Frontend Project in React Native! If you encounter any issues or have further questions, feel free to reach out for assistance.