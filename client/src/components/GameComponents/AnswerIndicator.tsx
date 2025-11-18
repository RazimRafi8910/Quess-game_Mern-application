type Prop={
  questionNo: number
  state?: "CURRENT" | "NOTANSWERED" | "ANSWERED"
}

type SubProp = {
  questionNo:number
}

function CurrentQuestionIndicator({ questionNo }: SubProp) {
  return (
    <>
      <div className="inline-block mx-1">
      <input type="checkbox" id={`num`} className="hidden peer" disabled />

      <label
        htmlFor={`num`}
        className="relative w-6 h-6 border-4 border-gray-400 rounded-full bg-[#fff] cursor-pointer scale-110
                   active:scale-100 flex items-center justify-center text-[11px] font-semibold text-black select-none"
      >
        {/* Number inside */}
        <span
          className="transition-transform duration-200 font-semibold ease-linear
                     peer-checked:scale-110"
        >
          {questionNo}
        </span>
      </label>
    </div>
    </>
  )
}


function AnsweredIndicator({questionNo}:SubProp) {
  return (
    <>
      <div className="inline-block mx-1">
      <input type="checkbox" id={`num`} className="hidden peer" disabled />

      <label
        htmlFor={`num`}
        className="relative w-6 h-6 border-4 border-blue-500 rounded-full bg-[#fff] cursor-pointer
                   active:scale-90 flex items-center justify-center text-[11px] font-semibold text-black select-none"
      >
        {/* Number inside */}
        <span
          className="transition-transform duration-200 font-semibold   ease-linear
                     peer-checked:scale-110"
        >
          {questionNo}
        </span>
      </label>
    </div>
    </>
  )
}

function NotAnsweredIndicator({ questionNo }: SubProp) {
  return (
    <>
      <div className="inline-block mx-1">
      <input type="checkbox" id={`num`} className="hidden peer" />

      <label
        htmlFor={`num`}
        className="relative w-6 h-6 border-4 border-gray-600 rounded-full bg-[#fff] cursor-pointer
                   active:scale-90 flex items-center justify-center text-[11px] font-semibold text-black select-none"
      >
        {/* Number inside */}
        <span
          className="transition-transform duration-200 font-semibold   ease-linear
                     peer-checked:scale-110"
        >
          {questionNo}
        </span>
      </label>
    </div>
    </>
  )
}

function AnswerIndicator({questionNo,state}:Prop) {
  if (state == "ANSWERED") {
    return <AnsweredIndicator questionNo={questionNo } />
  } else if(state == "CURRENT") {
    return <CurrentQuestionIndicator questionNo={questionNo} />
  } else {
    return <NotAnsweredIndicator questionNo={questionNo} />
  }
  return (
    <>
      <div className="inline-block mx-1">
      <input type="checkbox" id={`num`} className="hidden peer" />

      <label
        htmlFor={`num`}
        className="relative w-6 h-6 border-4 border-gray-600 rounded-full bg-[#fff] cursor-pointer
                   active:scale-90 flex items-center justify-center text-[11px] font-semibold text-black select-none"
      >
        {/* Number inside */}
        <span
          className="transition-transform duration-200 font-semibold   ease-linear
                     peer-checked:scale-110"
        >
          {questionNo}
        </span>
      </label>
    </div>
    </>
  )
}

export default AnswerIndicator