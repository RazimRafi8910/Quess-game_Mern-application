import { useNavigate } from "react-router-dom";
import HomeButton from "../components/Buttons/HomeButton";
import LeaderBoard from "../components/LeaderBoard/LeaderBoard";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

function Home() {
  const navigate = useNavigate()
  const userState = useSelector((state: RootState) => state.userReducer.logined);

  return (
    <>
      <div className="mx-auto text-white text-center">
        <div className="align-middle h-full grid grid-cols-1 px-2 content-center mt-14">
          <div className="text-5xl md:text-6xl mb-3.5 font-bold">
            <h1>Quess Game</h1>
          </div>
          <div>
            <p className="text-sm md:text-xl text-slate-300">
              {" "}
              <span className="text-blue-500 text-xl md:text-2xl font-black">
                Quess game{" "}
              </span>
              is a question and answer game where players test their knowledge
              on a topic or topics. <br /> This is an Online game where you can
              Play with
              <span className="text-yellow-600 font-bold text-xl">
                {" "}
                Strangers
              </span>
            </p>
            <p className="text-gray-500 font-mono">it's just a quiz game!</p>
          </div>
          <div className="my-7">
            <HomeButton content="Create Game" onClick={()=>{navigate('/room')}} buttonType='button' backGround="bg-gradient-to-tr from-black to-slate-900 hover:from-gray-800 hover:to-gray-600" className="mx-2" />
            <HomeButton content="Join Game" onClick={()=>{navigate('/game')}} buttonType='button' className="mx-2 " />
            { !userState && <p className="text-sm text-amber-100">Login to play</p> }
          </div>
        </div>
        <div className="mb-5">
            <div className="w-full mt-7 mb-3">
              <h1 className="text-2xl text-center font-bold">LeaderBoard</h1>
            </div>
            <LeaderBoard />
          </div>
      </div>
    </>
  );
}

export default Home;
