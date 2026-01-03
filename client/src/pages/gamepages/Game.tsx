import { useEffect, useRef, useState } from "react";
import OptionDIv from "../../components/GameComponents/OptionDIv";
import TimerSection, { TimerSectionRef } from "../../components/GameComponents/TimerSection";
import ChatBox from "../../components/ChatComponents/ChatBox";
import { useNavigate, useOutletContext, useParams, } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { GameRoomPlayerType, GameRoomType, GameStateType, QuestionOptionType, QuestionStatus, QuestionType, SocketEvents } from "../../types";
import AnswerIndicator from "../../components/GameComponents/AnswerIndicator";
import SubmitModal from "../../components/modal/SubmitModal";
import { useGameSocket } from "../../Hooks/useGameSocket";

function Game() {
  const { id: gameId } = useParams();
  const timerRef = useRef<TimerSectionRef|null>(null);
  const socket = useOutletContext<Socket | null>();
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();
  const { game, updateGameState, socketError, currentPlayer, gameState, setGameState } = useGameSocket({ socket: socket, gameId: gameId });
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [error, setError] = useState<string>('')
  const [gameQuestion, setGameQuestion] = useState<QuestionType[] | null>(null);
  const [questionAttented, setQestionAttented] = useState(0);

  useEffect(() => {
    if (gameState == GameStateType.FINISHED) {
      setSubmit(true);
    }
  },[])

  //get new question
  useEffect(() => {
    if (gameQuestion === null || gameQuestion.length == 0) {
     socket?.emit(SocketEvents.GAME_QUESTION, { gameId }, (response: { game: GameRoomType, status: boolean, error?: boolean, message: string }) => {
      if (response.status && !response.error) {
        setGameQuestion(response.game.questions);
        updateGameState(response.game);
      } else {
        console.log("from question update" + response)
        if (response.message) setError(response.message);
      }
    }); 
    }
   }, [game])

  //TODO:update the current question status
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => {
      if (gameQuestion?.length && gameQuestion?.length - 1 == prev) {
        return prev;
      }
      return prev + 1;
    });
  }

  const handleBackQuestion = () => {
    setCurrentQuestion((prev) => {
      if (prev != 0) {
        return prev - 1
      }
      return prev;
    });
  }

  const updatePlayerQuestionState = (answeredOption:QuestionOptionType["option"] | null, status:QuestionStatus) => {
    setGameQuestion((prev) => {
      if (!prev || !prev[currentQuestion]) return prev;

      const updated = [...prev];
      updated[currentQuestion] = {
        ...updated[currentQuestion],
        playerState: {
          answeredOption,
          questionStatus:status
        }
      }
      return updated;
    })
  }

  const finishGameState = () => {
    setGameState(GameStateType.FINISHED);
  }
  
  const handleEndTimer = () => {
    console.log("time finished")
    //finishGameState() // change local gamestate to finish
    openSubmitModal()
  }

  const handleSubmit = () => {
    setGameState(GameStateType.FINISHED);
    const submitData = {
      timeLeft: timerRef.current?.getTimer(),
      questionAnswer: gameQuestion,
      playerId: currentPlayer?.playerId,
      gameId,
    }
    console.log(submitData);
    socket?.emit(SocketEvents.GAME_PLAYER_SUBMIT, {gameId,submitData}, (response:any) => {
      if (response.status) {
        navigate(`/result/${gameId}`);
      }
    });
  }

  const handleModalClose = () => {
    setQestionAttented(0);
      setSubmit(false)
  }

  const openSubmitModal = () => {
    setSubmit(true)
    const attentedNo = gameQuestion?.reduce<number>((attented, item) => {
      if (item.playerState !== undefined && item.playerState.answeredOption !== null) attented++
      return attented
    }, 0) || 0;
    setQestionAttented(attentedNo);
  }

  const handeleSelect = (option: QuestionOptionType['option']) => {
    updatePlayerQuestionState(option, QuestionStatus.ANSWERED);
  }

  const handleClearSelect = () => {
    updatePlayerQuestionState(null, QuestionStatus.NOTANSWERED);
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="md:w-1/2 md:mx-0 w-full mx-10">
            <SubmitModal
              isOpen={submit}
              questionAttented={questionAttented}
              questionLen={gameQuestion?.length || 0}
              timeTaken={timerRef.current?.getTimer}
              gameState={gameState}
              handleModalClose={handleModalClose}
              handleSubmit={handleSubmit}
              finishGameState={finishGameState} />
            <TimerSection
              ref={timerRef}
              socket={socket}
              game={game}
              handleEndTimer={handleEndTimer}
              currentPlayer={currentPlayer as GameRoomPlayerType} />
            
            <div>
              <p className="text-md text-red-500 text-center">{ socketError }</p>
              <p className="text-md text-red-500 text-center">{ error }</p>
            </div>

            <div className="flex justify-center my-2">
              {gameQuestion?.map((item, index) => {
                const status = item.playerState?.questionStatus
                return <AnswerIndicator key={item._id} questionNo={index + 1} state={currentQuestion == index ? "CURRENT" : status} />
              })}
            </div>
            
            {
              gameQuestion !== null ? gameQuestion.length != 0 &&
              <>
                <div className="bg-gray-900/[0.5] py-4 border border-gray-700 rounded-lg text-center">
                  <h1 className="font-medium md:text-xl text-slate-300">{ gameQuestion[currentQuestion].question }</h1> 
                </div>
                <div className="grid md:grid-cols-2 gap-2 mt-3 md:mx-0">
                  {
                    gameQuestion[currentQuestion].options.map((item, index) => (
                      <OptionDIv key={index} option={item.option} questionStatus={gameQuestion[currentQuestion].playerState} optionValue={item.optionValue} handleSelect={handeleSelect} />
                    ))
                  }
                </div>
              </>

                :
                <p className="text-red-500 text-base">Failed to load question<a className="ms-2 text-amber-600 underline" href="/">/home</a></p>
              
            }

            
            <div className="mt-2">
              <div className="flex justify-center gap-2">
                <button className="text-white bg-blue-900 px-5 py-2 rounded-lg hover:bg-red-200 hover:text-black" onClick={handleBackQuestion}>back</button>                
                <button className="text-white bg-neutral-600 px-5 rounded-lg hover:bg-slate-300 hover:text-neutral-900" onClick={handleClearSelect}>clear</button>
                {
                  gameQuestion &&
                  gameQuestion.length-1 === currentQuestion ? 
                    <button className="text-white bg-orange-900 px-5 py-2 rounded-lg hover:bg-green-300 hover:text-neutral-800" onClick={openSubmitModal}>Submit</button>
                    :
                    <button className="text-white bg-blue-900 px-5 py-2 rounded-lg hover:bg-green-300 hover:text-neutral-800" onClick={handleNextQuestion}>Next</button>
                }
                
              </div>
            </div>

            <div className="chat">
              <ChatBox Players={game?.players}/>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Game;
