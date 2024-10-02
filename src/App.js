import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const CrosswordGame = () => {
  const [word, setWord] = useState('');

  const fetchRandomWord = async () => {
    try {
      const response = await axios.get('https://random-word-api.vercel.app/api?words=1');
      setWord(response.data[0]);
    } catch (error) {
      console.error('Error fetching the word:', error);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  return (
    <div className="game-container">
      <h1>Crossword Game</h1>
      <p>Your Word: {word}</p>
    </div>
  );
};

export default CrosswordGame;

