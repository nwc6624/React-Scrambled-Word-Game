# Getting Started with Create React App


# demo image as of 10/2/24
![image](https://github.com/user-attachments/assets/494d23a2-dc78-46d4-a90e-5aee7df27cb0)


**React**: Frontend framework for building interactive user interfaces.
**React DnD**: Enables drag-and-drop functionality for interactive gameplay.
**Axios**: Used for making HTTP requests to fetch random words from the API.
**JavaScript (ES6)**: Core language for logic and interactivity.
**CSS**: Styling for the crossword game layout and components.
**Random Word API**: Provides random words to challenge the player.
# This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features
**Drag or Click Letters:**

Players can drag letters from the bank to the blanks or simply click them to place them in the leftmost empty slot.
Once a letter has been used, it turns red and becomes unselectable.
**Check for Correctness:**

When the "Check" button is pressed, a popup will inform the user if the word is correct or how many letters are wrong.
If the word is spelled incorrectly, the player can opt to receive a hint, where a blank or incorrect letter will be filled in automatically.
**Get New Words:**

When the player completes the word correctly, they are given the option to fetch a new word and continue playing.
**Hints System:**

Players can ask for hints if the word is spelled incorrectly. The hint will fill in a correct letter in the word and mark the corresponding letter as used.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Structure
/src: Contains all source code, including the main components like App.js and styling in App.css.
/public: Contains the public assets and the index.html file, which is the entry point for the React application.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
