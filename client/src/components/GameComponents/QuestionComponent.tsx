import { useState } from "react"
import OptionDIv from "./OptionDIv"

const data = [
    {
        option: 'A',
        optionValue: "programing language"
    },
    {
        option: 'B',
        optionValue: "natural language"
    },
    {
        option: 'C',
        optionValue: "machine code"
    },
    {
        option: 'D',
        optionValue: "computer language"
    }
]

function QuestionComponent() {
    const [option, setOption] = useState<string>('')
    return (
        <>
            <div className="container">
                <div className="mx-11 my-2 py-6 rounded-lg bg-slate-500/[.5] border border-gray-500">
                    <div>
                        <p className="text-sm lg:text-lg text-white">The first quiz question for the testing puroposes, what is java
                            puroposes, what is java?
                        </p>
                    </div>
                </div>
                <div className="mx-11 my-2 flex flex-col">
                    {data.map((element,index) => (
                        <OptionDIv key={index} option={element.option} optionValue={element.optionValue} selectedOption={option} optionFunc={setOption} />
                    ))}
                </div>
                <div className="flex justify-between align-middle mx-11 lg:px-3 py-3">
                    <div>
                        <button type="button" className="self-end px-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Previous 
                        </button>
                    </div>
                    <div className="mt-2">
                        <h1>Selected : { option }</h1>
                    </div>
                    <div>
                        <button type="button" className="self-end px-7 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Next 
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default QuestionComponent