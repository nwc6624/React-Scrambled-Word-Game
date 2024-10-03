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

const ScrambledWordGame = () => {
  const [word, setWord] = useState('');
  const [blanks, setBlanks] = useState([]);
  const [letterBank, setLetterBank] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [hintColors, setHintColors] = useState([]);
  const [gameStatus, setGameStatus] = useState('');
  const [modifiedLetters, setModifiedLetters] = useState([]);

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
      setModifiedLetters([]);
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
    const newModifiedLetters = [...modifiedLetters];
    newModifiedLetters[index] = true;
    setModifiedLetters(newModifiedLetters);
    const newHintColors = [...hintColors];
    newHintColors[index] = '';
    setHintColors(newHintColors);
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
      const newModifiedLetters = [...modifiedLetters];
      newModifiedLetters[emptyIndex] = true;
      setModifiedLetters(newModifiedLetters);
      const newHintColors = [...hintColors];
      newHintColors[emptyIndex] = '';
      setHintColors(newHintColors);
    }
  };

  const checkIfCorrect = () => {
    const currentWord = blanks.join('');
    let incorrectCount = 0;
    let correctPositions = [];
    let newHintColors = [];
    let newUsedLetters = [...usedLetters];
    for (let i = 0; i < word.length; i++) {
      if (blanks[i] === word[i]) {
        correctPositions.push(i);
        newHintColors[i] = 'green';
        newUsedLetters[letterBank.indexOf(blanks[i])] = true;
      } else {
        incorrectCount++;
        newHintColors[i] = 'red';
        newUsedLetters[letterBank.indexOf(blanks[i])] = false;
      }
    }
    if (currentWord === word) {
      setFeedback('Congratulations, you win!');
      setGameStatus('won');
      setShowPopup(true);
    } else {
      setFeedback(`You have ${correctPositions.length} correct letter(s). ${incorrectCount} incorrect.`);
      setShowPopup(true);
    }
    setUsedLetters(newUsedLetters);
    setHintColors(newHintColors);
    setModifiedLetters([]);
  };

  const resetGame = () => {
    setShowPopup(false);
    fetchNewWord();
  };

  const giveHint = () => {
    const incorrectIndexes = [];
    const newBlanks = [...blanks];
    const newUsedLetters = [...usedLetters];
    const newHintColors = [...hintColors];
    for (let i = 0; i < word.length; i++) {
      if (blanks[i] !== word[i] || blanks[i] === null) {
        incorrectIndexes.push(i);
      }
    }
    if (incorrectIndexes.length > 0) {
      const randomIncorrectIndex = incorrectIndexes[Math.floor(Math.random() * incorrectIndexes.length)];
      const correctLetter = word[randomIncorrectIndex];
      newBlanks[randomIncorrectIndex] = correctLetter;
      newHintColors[randomIncorrectIndex] = 'gold';
      setBlanks(newBlanks);
      setHintColors(newHintColors);
      const letterIndex = letterBank.indexOf(correctLetter);
      newUsedLetters[letterIndex] = true;
      setUsedLetters(newUsedLetters);
      setShowPopup(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="game-container">
        <h1>Scrambled Word Game</h1>
        <p className="description">
          Try to unscramble the letters to form the correct word. Drag or click on letters and place them in the correct slots. 
          Click "Check" when you're ready to see if you've guessed correctly. Use hints if you get stuck!
        </p>
        <div className="word">
          {blanks.map((letter, index) => (
            <Slot
              key={index}
              letter={letter}
              index={index}
              onDrop={handleDrop}
              color={modifiedLetters[index] ? '' : hintColors[index]}
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
              {gameStatus === 'won' ? (
                <button onClick={resetGame}>Try a new word</button>
              ) : (
                <>
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
                  <button onClick={giveHint}>Hint</button>
                </>
              )}
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default ScrambledWordGame;

};

export default CrosswordGame;

