import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

const Slot = ({ letter, index, onDrop }) => {
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
      style={{ backgroundColor: isOver ? 'lightblue' : 'white' }}
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
  const [gameStatus, setGameStatus] = useState(''); // Tracks whether the user is correct or needs a hint

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
    }
  };

  const checkIfCorrect = () => {
    const currentWord = blanks.join('');
    let incorrectCount = 0;
    let correctPositions = [];
    let newHintColors = [];

    if (currentWord.length < word.length) {
      let hints = '';
      for (let i = 0; i < word.length; i++) {
        if (blanks[i] === word[i]) {
          correctPositions.push(i);
          newHintColors[i] = 'green';
        } else {
          incorrectCount++;
          newHintColors[i] = 'red';
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
        } else {
          newHintColors[i] = 'green';
        }
      }
      setFeedback(`Incorrect. ${incorrectCount} letters are wrong.`);
      setGameStatus('incorrect');
    }

    setHintColors(newHintColors);
    setShowPopup(true);
  };

  const giveHint = () => {
    const incorrectIndexes = [];
    const newBlanks = [...blanks];
    const newUsedLetters = [...usedLetters];

    // Find the first incorrect or empty letter
    for (let i = 0; i < word.length; i++) {
      if (blanks[i] !== word[i] || blanks[i] === null) {
        incorrectIndexes.push(i);
      }
    }

    if (incorrectIndexes.length > 0) {
      const firstIncorrectIndex = incorrectIndexes[0];
      const correctLetter = word[firstIncorrectIndex];

      newBlanks[firstIncorrectIndex] = correctLetter;
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
            <Slot key={index} letter={letter} index={index} onDrop={handleDrop} />
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
