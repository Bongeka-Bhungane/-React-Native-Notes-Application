<img src="https://socialify.git.ci/Bongeka-Bhungane/-React-Native-Notes-Application/image?description=1&font=Raleway&language=1&name=1&owner=1&pattern=Circuit+Board&theme=Light" alt="-React-Native-Notes-Application" width="640" height="320" />

# -React-Native-Notes-Application
### Overview

The NotIQ is a mobile app that allows users to create, manage, and organize notes into categories such as Work, Study, and Personal. The application demonstrates core React Native concepts including navigation, authentication, protected routing, and CRUD operations.

The app uses AsyncStorage to store user and notes data locally on the device. Users can register, log in, manage their profile, and create, update, search, and delete notes.

This project was developed as part of a React Native learning curriculum to demonstrate understanding of navigation systems, routing, and state management.

## Features
### User Management
### Authentication

* Users can register using:

* Email address

* Username

* Password

* Users can log in using their credentials.

* User information is securely stored using AsyncStorage.

### Authorization

* The application uses protected routing.

* Users must be logged in to access the main app screens.

* Logged-in users cannot access the login or registration pages.

### Profile Management

Users can update their:

* Username

* Email

* Password

## Notes Management
### Add Notes

Users can create a new note with:

* Note text

* Date added

* Category (Work, Study, Personal)

* Optional title

### View Notes

Users can:

* View all notes they created

* View notes grouped by category

### Update Notes

Users can:

* Edit existing notes

* Updated notes automatically store a timestamp of when they were edited

### Delete Notes

Users can remove notes from the application.

* Search Notes

* Users can search for notes by typing keywords.
* The app attempts to match the entered text with words found in the saved notes.

### Sort Notes

Notes can be sorted by:

* Date added (Ascending)

* Date added (Descending)

### Categories

The application organizes notes into the following categories:

* Work

* Study

* Personal

* Each category is accessible on a separate screen using React Navigation.

## Technologies Used

* React Native

* Expo

* React Navigation

* AsyncStorage

* TypeScript

## Navigation Structure

The application uses React Navigation to manage routing between screens.

 * Main Screens

* Login Screen

* Register Screen

* Home Screen

* Category Screen

* Create Note Screen

* Edit Note Screen

* Profile Screen

* Protected routes ensure that only authenticated users can access note-related screens.

## Installation

Clone the repository
```
git clone https://github.com/Bongeka-Bhungane/-React-Native-Notes-Application
```
Navigate to the project folder
```
cd react-native-notes-app
```
Install dependencies
```
npm install
```
Start the development server
```
npx expo start
```
Run the app on:

Expo Go on your phone

## Author

Bongeka Bhungane
