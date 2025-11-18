import { QuestionOptionType, QuestionType } from "../../types";

interface OptionDivProps {
  option: QuestionOptionType['option'];
  optionValue: string;
  questionStatus: QuestionType['playerState'];
  handleSelect:(option:QuestionOptionType['option'])=>void
}


function OptionDIv({ option, optionValue, handleSelect, questionStatus }: OptionDivProps) {
  return (
      <>
          <div className="" onClick={()=>{handleSelect(option)}}>
            <div className={`flex border-[2px] ${questionStatus?.answeredOption == option ? "border-blue-700" :  "border-gray-700"} rounded-lg`}>
          <h5 className={`border-r-2 p-2 ${questionStatus?.answeredOption == option ? "bg-blue-700" : "bg-neutral-700"} text-slate-300 `}>{ option }</h5>
                    <div className="w-full">
                      <div className={`flex py-2 px-3 ${ questionStatus?.answeredOption === option ? "border-blue-700" : "border-gray-700 "  } bg-gray-900/[0.5] text-slate-300 rounded-r-lg`}>
                          <p className="mx-3">{ optionValue }</p>
                        </div>
                    </div>
                </div>
          </div>
      </>
  )
}

export default OptionDIv