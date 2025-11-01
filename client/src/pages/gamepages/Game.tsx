import { useEffect, useState } from "react";
import OptionDIv from "../../components/GameComponents/OptionDIv";
import TimerSection from "../../components/GameComponents/TimerSection";
import ChatBox from "../../components/ChatComponents/ChatBox";
import { useOutletContext, useLocation, useParams, useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import { GameRoomType, QuestionType, ServerSocketEvnets, SocketEvents } from "../../types";
import AnswerIndicator from "../../components/GameComponents/AnswerIndicator";

function Game() {
  const { id: gameId } = useParams();
  const socket = useOutletContext<Socket | null>();
  const location = useLocation()
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [error, setError] = useState<string>('')
  const [game, setGame] = useState<GameRoomType | null>(location.state.game);
  const [gameQuestion, setGameQuestion] = useState<QuestionType[] | null>(null);
  const [selected, setSelected] = useState<null | string>(null);

  useEffect(() => {
    const handleSocketError = (res: { message: string, redirect:boolean }) => {
			if (res.message) {
        setError(res.message);
      }
      if (res.redirect) {
        navigate('/');
      }
		};
    socket?.on(ServerSocketEvnets.SOCKET_ERROR, handleSocketError);
    return () => {
			socket?.off(ServerSocketEvnets.SOCKET_ERROR, handleSocketError);
		};
  },[])

  //get new questions
  useEffect(() => {
    socket?.emit(SocketEvents.GAME_QUESTION, { gameId }, (response: { status: boolean, error?: boolean, message: string, question: QuestionType[] }) => {
      if (response.status && !response.error) {
        // setGame((prev) => {
        //   if (prev !== null) {
        //     return { ...prev, questions: response.question }
        //   }
        //   return prev
        // })
        setGameQuestion(response.question);
      } else {
        console.log("from question update" +response)
        if (response.message) setError(response.message);
      }
    });
    
  }, []);

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => {
      if (gameQuestion?.length && gameQuestion?.length - 1 == prev) {
        return prev;
      }
      return prev + 1;
    })
  }

  const handleBackQuestion = () => {
    setCurrentQuestion((prev) => {
      if (prev != 0) {
        return prev - 1
      }
      return prev;
    });
  }
  

  const handeleSelect = (option: string) => {
    setSelected(option);
  }

  const handleClearSelect = () => {
    setSelected(null);
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="md:w-1/2 md:mx-0 w-full mx-10">
            <TimerSection />
            
            <div>
              <p className="text-md text-red-500 text-center">{ error }</p>
            </div>

            <div className="flex justify-center my-2">
              {gameQuestion?.map((item, index) => {
                const status = item.playerState?.questionStatus
                return <AnswerIndicator questionNo={index + 1} state={currentQuestion == index ? "CURRENT" : status} />
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
                      <OptionDIv option={item.option} optionValue={item.optionValue} currentSelectOption={ selected } handleSelect={handeleSelect} />
                    ))
                  }
                  {/* <OptionDIv option="B" optionValue="for the test" currentSelectOption={ selected } handleSelect={handeleSelect} />
                  <OptionDIv option="C" optionValue="test" currentSelectOption={ selected } handleSelect={handeleSelect}/>
                  <OptionDIv option="D" optionValue="manual" currentSelectOption={ selected } handleSelect={handeleSelect}/> */}
                </div>
              </>

                :
                <p className="text-red-500 text-base">Failed to load question<a className="ms-2 text-amber-600 underline" href="/">/home</a></p>
              
            }        

           

            
            <div className="mt-2">
              <div className="flex justify-center gap-2">
                <button className="text-white bg-blue-900 px-5 py-2 rounded-lg hover:bg-red-200 hover:text-black" onClick={handleBackQuestion}>back</button>
                <button className="text-white bg-neutral-600 px-5 rounded-lg hover:bg-slate-300 hover:text-neutral-900" onClick={handleClearSelect}>clear</button>
                <button className="text-white bg-blue-900 px-5 py-2 rounded-lg hover:bg-green-300 hover:text-neutral-800" onClick={handleNextQuestion}>Next</button>
              </div>
            </div>

            <div className="chat">
              <ChatBox/>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Game;
