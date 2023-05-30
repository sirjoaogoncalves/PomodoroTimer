import React, { useState, useEffect } from "react";
import '../styles/PomodoroTimer.css';
import bellSound from '../sounds/bell.mp3';
import rainSound from '../sounds/rain.mp3';

const PomodoroTimer = () => {
  const [studyDuration, setStudyDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timer, setTimer] = useState(studyDuration * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    if (timer === 0) {
      clearInterval(interval);
      if (studyDuration > 0) {
        playSoundEffect(bellSound); // Play bell sound for break period
      } else {
        playSoundEffect(rainSound); // Play rain sound for study period
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timer, studyDuration]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(studyDuration * 60);
  };

  const handleStudyDurationChange = (event) => {
    setStudyDuration(parseInt(event.target.value));
    if (!isActive) {
      setTimer(parseInt(event.target.value) * 60);
    }
  };

  const handleBreakDurationChange = (event) => {
    setBreakDuration(parseInt(event.target.value));
  };

const playSoundEffect = (sound) => {
  fetch(sound)
    .then((response) => response.arrayBuffer())
    .then((buffer) => {
      const context = new AudioContext();
      context.decodeAudioData(buffer, (audioBuffer) => {
        const source = context.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(context.destination);
        source.start();
      });
    })
    .catch((error) => console.log(error));
};
  

  return (
    <div className="container">
      <h1>Pomodoro Timer</h1>
      <div className="timer">{formatTime(timer)}</div>
      <div className="input-group">
        <label>Study Duration (minutes):</label>
        <input
          type="number"
          min="1"
          value={studyDuration}
          onChange={handleStudyDurationChange}
        />
      </div>
      <div className="input-group">
        <label>Break Duration (minutes):</label>
        <input
          type="number"
          min="1"
          value={breakDuration}
          onChange={handleBreakDurationChange}
        />
      </div>
      <div className="button-group">
        <button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;

