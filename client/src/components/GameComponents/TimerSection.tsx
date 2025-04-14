import { useState } from "react";


function TimerSection() {
    const [timer, setTimer] = useState();
    return (
        <>
            <div className="flex justify-between mb-5 text-white">
                <div>
                    <p className="mt-1 mb-1 text-gray-300">Q-2/3</p>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-emerald-300 mt-1">12:29</h1>
                </div>
                <div>
                    <button className="bg-gray-600/[.5] px-2 py-1 rounded-lg border border-slate-200">
                        <i className="fa-solid fa-gear"></i>
                    </button>
                </div>
            </div>
        </>
    );
}
  
export default TimerSection;
  