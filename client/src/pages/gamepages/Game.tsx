import AnswerIndicator from "../../components/GameComponents/AnswerIndicator";
import QuestionComponent from "../../components/GameComponents/QuestionComponent";

function Game() {
  return (
    <>
        <div className="mx-auto">
          <div className="flex text-gray-300 flex-col md:flex-row mt-6">
            <div className="text-center flex flex-col md:border-r-[3px] border-gray-400 lg:w-1/2 md:w-1/2">
              <AnswerIndicator />
            <h2>Score : 1</h2>
            <div className=" flex justify-center flex-col">
              <div className="mt-4 sm:mt-5">
                <h1 className="md:text-xl sm:text-xl text-left text-xl ms-11 font-semibold">1 - Question</h1>
              </div>
              <QuestionComponent/>
            </div>
            </div>
            <div className="text-center lg:w-1/2 md:w-1/2">
              <h2>Chat  </h2>
            </div>
          </div>
        </div>
        <div>Game </div>
    </>
  );
}

export default Game;
