import { useEffect, useState } from "react";
import OptionDIv from "../../components/GameComponents/OptionDIv";
import TimerSection from "../../components/GameComponents/TimerSection";
import { io } from "socket.io-client";
import ChatBox from "../../components/ChatComponents/ChatBox";

//const socket = io('http://localhost:3001');

function Game() {
  const [selected, setSelected] = useState<null | string>(null);

  const handeleSelect = (option:string) => {
    setSelected(option);
  }

  const handleClearSelect = () => {
    setSelected(null);
  }

  useEffect(() => {
    // socket.on('connect', () => {
    //   console.log('df');
    //   socket.on('message',()=>{console.log('sdf')})
    // })    
  },[])

  return (
    <>
      <div className="container mx-auto">
        <div className="flex justify-center">
          <div className="md:w-1/2 md:mx-0 w-full mx-10">
        <TimerSection/>
            
            <div>
              <div className="bg-gray-900/[0.5] py-4 border border-gray-700 rounded-lg text-center">
                <h1 className="font-medium md:text-xl text-slate-300">This is for testing question</h1>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-2 mt-3 md:mx-0">
              <OptionDIv option="A" optionValue="Testing" currentSelectOption={ selected } handleSelect={handeleSelect} />
              <OptionDIv option="B" optionValue="for the test" currentSelectOption={ selected } handleSelect={handeleSelect} />
              <OptionDIv option="C" optionValue="test" currentSelectOption={ selected } handleSelect={handeleSelect}/>
              <OptionDIv option="D" optionValue="manual" currentSelectOption={ selected } handleSelect={handeleSelect}/>
            </div>

            
            <div className="mt-2">
              <div className="flex justify-center gap-2">
                <button className="text-white bg-blue-900 px-5 py-2 rounded-lg hover:bg-red-200 hover:text-black">back</button>
                <button className="text-white bg-neutral-600 px-5 rounded-lg hover:bg-slate-300 hover:text-neutral-900" onClick={handleClearSelect}>clear</button>
                <button className="text-white bg-blue-900 px-5 py-2 rounded-lg hover:bg-green-300 hover:text-neutral-800 ">Next</button>
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
