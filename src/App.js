import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const Slot = ({ letter, index, onDrop, color }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'letter',
    drop: (item) => onDrop(item.letter, index),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="slot"
      style={{ backgroundColor: color || (isOver ? 'lightblue' : 'white') }}
    >
      {letter || '_'}
    </div>
  );
};

const Letter = ({ letter, index, onClick, isUsed }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'letter',
    item: { letter, index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="letter"
      onClick={() => !isUsed && onClick(letter)}
      style={{
        opacity: isDragging || isUsed ? 0.5 : 1,
        backgroundColor: isUsed ? 'red' : '#ffeb3b',
        cursor: isUsed ? 'not-allowed' : 'pointer',
      }}
    >
      {letter}
    </div>
  );
};

const CrosswordGame = () => {
  const [word, setWord] = useState('');
  const [blanks, setBlanks] = useState([]);
  const [letterBank, setLetterBank] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hintColors, setHintColors] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [isCorrected, setIsCorrected] = useState(false); // Track whether letters are being corrected

  useEffect(() => {
    fetchNewWord();
  }, []);

  const fetchNewWord = async () => {
    try {
      const response = await axios.get('https://random-word-api.vercel.app/api?words=1');
      const fetchedWord = response.data[0];
      setWord(fetchedWord);

      setBlanks(new Array(fetchedWord.length).fill(null));

      const letters = fetchedWord.split('').sort(() => Math.random() - 0.5);
      setLetterBank(letters);
      setUsedLetters(new Array(letters.length).fill(false));
      setGameStatus('');
      setShowPopup(false);
      setIsCorrected(false); // Reset the correction state
    } catch (error) {
      console.error('Error fetching the word:', error);
    }
  };

  const handleDrop = (droppedLetter, index) => {
    const newBlanks = [...blanks];
    newBlanks[index] = droppedLetter;
    setBlanks(newBlanks);

    const newUsedLetters = [...usedLetters];
    const letterIndex = letterBank.indexOf(droppedLetter);
    newUsedLetters[letterIndex] = true;
    setUsedLetters(newUsedLetters);

    setIsCorrected(true); // Mark as corrected, to reset color to white
    setHintColors(new Array(blanks.length).fill('')); // Reset hint colors for corrected letters
  };

  const handleClick = (clickedLetter) => {
    const newBlanks = [...blanks];
    const emptyIndex = newBlanks.findIndex((letter) => letter === null);

    if (emptyIndex !== -1) {
      newBlanks[emptyIndex] = clickedLetter;
      setBlanks(newBlanks);

      const newUsedLetters = [...usedLetters];
      const letterIndex = letterBank.indexOf(clickedLetter);
      newUsedLetters[letterIndex] = true;
      setUsedLetters(newUsedLetters);

      setIsCorrected(true); // Mark as corrected
      setHintColors(new Array(blanks.length).fill('')); // Reset hint colors
    }
  };

  const checkIfCorrect = () => {
    const currentWord = blanks.join('');
    let incorrectCount = 0;
    let correctPositions = [];
    let newHintColors = [];
    let newUsedLetters = [...usedLetters]; // Modify used letters array to mark incorrect ones as available again

    if (currentWord.length < word.length) {
      let hints = '';
      for (let i = 0; i < word.length; i++) {
        if (blanks[i] === word[i]) {
          correctPositions.push(i);
          newHintColors[i] = 'green';
          newUsedLetters[letterBank.indexOf(blanks[i])] = true; // Lock correct letters
        } else {
          incorrectCount++;
          newHintColors[i] = 'red';
          newUsedLetters[letterBank.indexOf(blanks[i])] = false; // Allow incorrect letters to be moved again
        }
      }
      hints = `You have ${correctPositions.length} correct letter(s) in the right position. ${incorrectCount} incorrect.`;
      setFeedback(hints);
    } else if (currentWord === word) {
      setFeedback('Great job! You spelled the word correctly!');
      setGameStatus('correct');
      newHintColors = new Array(word.length).fill('green');
    } else {
      for (let i = 0; i < word.length; i++) {
        if (word[i] !== blanks[i]) {
          incorrectCount++;
          newHintColors[i] = 'red';
          newUsedLetters[letterBank.indexOf(blanks[i])] = false; // Allow incorrect letters to be moved again
        } else {
          newHintColors[i] = 'green';
          newUsedLetters[letterBank.indexOf(blanks[i])] = true; // Lock correct letters
        }
      }
      setFeedback(`Incorrect. ${incorrectCount} letters are wrong.`);
      setGameStatus('incorrect');
    }

    setUsedLetters(newUsedLetters); // Update used letters to allow incorrect ones to be moved
    setHintColors(newHintColors);
    setIsCorrected(false); // Set correction flag to false after check
  };

  const giveHint = () => {
    const incorrectIndexes = [];
    const newBlanks = [...blanks];
    const newUsedLetters = [...usedLetters];

    // Find all incorrect or empty letters
    for (let i = 0; i < word.length; i++) {
      if (blanks[i] !== word[i] || blanks[i] === null) {
        incorrectIndexes.push(i);
      }
    }

    if (incorrectIndexes.length > 0) {
      // Randomly select an incorrect letter
      const randomIncorrectIndex = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
      const correctLetter = word[randomIncorrectIndex];

      newBlanks[randomIncorrectIndex] = correctLetter;
      setBlanks(newBlanks);

      // Mark the correct letter as used
      const letterIndex = letterBank.indexOf(correctLetter);
      newUsedLetters[letterIndex] = true;
      setUsedLetters(newUsedLetters);

      setShowPopup(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-container">
        <h1>Crossword Game</h1>
        <div className="word">
          {blanks.map((letter, index) => (
            <Slot
              key={index}
              letter={letter}
              index={index}
              onDrop={handleDrop}
              color={isCorrected && hintColors[index] === 'red' ? '' : hintColors[index]} // Reset incorrect to white/clear if corrected
            />
          ))}
        </div>

        <h2>Letter Bank</h2>
        <div className="letter-bank">
          {letterBank.map((letter, index) => (
            <Letter
              key={index}
              letter={letter}
              index={index}
              onClick={handleClick}
              isUsed={usedLetters[index]}
            />
          ))}
        </div>

        <button onClick={checkIfCorrect} className="check-button">Check</button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>{feedback}</h2>
              <div className="hint-word">
                {blanks.map((letter, index) => (
                  <span
                    key={index}
                    style={{ color: hintColors[index] }}
                    className="hint-letter"
                  >
                    {letter || '_'}
                  </span>
                ))}
              </div>

              {gameStatus === 'correct' ? (
                <button onClick={fetchNewWord}>New Word</button>
              ) : (

                <button onClick={giveHint}>Hint</button>
              )}

              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CrosswordGame;

