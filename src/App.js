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

const Letter = ({ letter }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'letter',
    item: { letter },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="letter"
      style={{
        opacity: isDragging ? 0.5 : 1,
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
  const [showPopup, setShowPopup] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await axios.get('https://random-word-api.vercel.app/api?words=1');
        const fetchedWord = response.data[0];
        setWord(fetchedWord);

        // Create blank slots for each letter in the word
        setBlanks(new Array(fetchedWord.length).fill(null));

        // Create letter bank (random letters + word letters)
        const letters = fetchedWord.split('');
        const randomLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
        const shuffledBank = [...letters, ...randomLetters.slice(0, 5)].sort(
          () => Math.random() - 0.5
        );
        setLetterBank(shuffledBank);
      } catch (error) {
        console.error('Error fetching the word:', error);
      }
    };

    fetchRandomWord();
  }, []);

  const handleDrop = (droppedLetter, index) => {
    const newBlanks = [...blanks];
    newBlanks[index] = droppedLetter;
    setBlanks(newBlanks);
  };

  const checkIfCorrect = () => {
    const currentWord = blanks.join('');
    let incorrectCount = 0;

    for (let i = 0; i < word.length; i++) {
      if (word[i] !== blanks[i]) {
        incorrectCount++;
      }
    }

    if (currentWord === word) {
      setFeedback('Correct! Great job!');
    } else {
      setFeedback(`Incorrect. ${incorrectCount} letters are wrong.`);
    }

    setShowPopup(true);
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
            <Letter key={index} letter={letter} />
          ))}
        </div>

        <button onClick={checkIfCorrect} className="check-button">Check</button>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <h2>{feedback}</h2>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default CrosswordGame;

