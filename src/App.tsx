import React, {useEffect, useState} from 'react'

import './App.css';

type Props = {
  word: string;
}

type StatusClasses = 'correct' | 'present' | 'absent' | "";
type Status = 3 | 2 | 1 | 0;
//
// type Element = [
//   [
//     {value:string; status: Status;}
//   ]
// ]

const classes: Record<Status, StatusClasses> = {
  3: 'correct',
  2: 'present',
  1: 'absent',
  0: ""
}

const initGuessList: {
  value: string
  status: Status
}[][] = Array(6).fill(null)
  .map(() => Array(5).fill(null)
    .map(() => ({value: '', status: 0}))
  )

const initKeyboard = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
]

export const App: React.FC<Props> = ({word}) => {
  const [guessList, setGuessList] = useState(initGuessList);

  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [step, setStep] = useState(0);
  const [isGameOver, setGameOver] = useState(false);
  const [gameMsg, setGameMsg] = useState('');



  const letterStatus: Record<string, number> = {};
  guessList.forEach(row => {
    row.forEach(letter => {
      if (letter.status) {
        if (letterStatus[letter.value]) {
          letterStatus[letter.value] = Math.max(letterStatus[letter.value],letter.status);
        } {
          letterStatus[letter.value] = letter.status;
        }
      }
    })
  });


  useEffect(() => {
    const keyEventHandler = (event: KeyboardEvent) => {

      if (event.key === 'Escape' && isGameOver){
        setCurrentGuess('');
        setStep(0);
        setGameOver(false);
        setGameMsg('');
        setGuessList(initGuessList);
      }

      if (isGameOver) return;

      if (event.key === 'Enter' && currentGuess.length === 5) {
        const tempState = [...guessList];
        const tempWord: Array<string | null> = [...word];
        const newRow = tempState[step].map((_, i) => {
          if(currentGuess[i] === tempWord[i]) {
            tempWord[i] = null;
            return ({
              value: currentGuess[i],
              status: 3 as Status,
            })
          }
          return ({
            value: currentGuess[i],
            status: 1 as Status,
          })
        });
        newRow.forEach((letter,i) => {
          const ind = tempWord.indexOf(letter.value)
          if(letter.status !== 3 && letter.status !== 2 && ind !== -1) {
            tempWord[ind] = null;
            letter.status = 2;
          }
        })
        tempState[step] = newRow;
        setGuessList(tempState);
        setCurrentGuess('');
        setStep(step + 1);

        if (currentGuess === word) {
          setGameOver(true);
          setGameMsg('You Win!!!!');
        }

        if (step === 5){
          setGameOver(true);
          setGameMsg('You lose! Correct word was: ' + word);
        }

      } else if (event.key === 'Backspace') {
        setCurrentGuess(currentGuess.slice(0, -1))
      } else if (event.key.length === 1 && /[a-z]/i.test(event.key) && currentGuess.length < 5) {
        setCurrentGuess(currentGuess + event.key);
      }
    }
    window.addEventListener("keydown", keyEventHandler);
    return () => window.removeEventListener("keydown", keyEventHandler);
  }, [currentGuess, step])

  return (
    <main className="main">
      <h1>Wordle</h1>
      {
        gameMsg && (
          <h2>{gameMsg}</h2>
        )
      }
      <div className="board">
        {
          guessList.map((row, indexRow) => (
            <div key={indexRow} className="board__row">
              {
                indexRow === step ? (
                  row.map((_, i) => (
                    <div className="board__letter">
                      {currentGuess?.[i] ?? ""}
                    </div>
                  ))
                ) : (
                  row.map(letter => (
                    <div className={`board__letter ${classes[letter.status]}`}>
                      {letter.value}
                    </div>
                  ))
                )
              }
            </div>
          ))
        }
      </div>
      <div className="keyboard">
        {
          initKeyboard.map((row, index) => (
            <div key={index} className="keyboard__row">
              {
                row.map(letter => (
                  <div className={`keyboard__cell ${letterStatus?.[letter] ? classes[letterStatus[letter] as Status] : ''}`}>
                    {letter}
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    </main>
  )
}
