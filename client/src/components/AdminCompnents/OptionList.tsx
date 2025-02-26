import { QuestionOptionType } from "../../types"

interface OptionListProps {
    options: QuestionOptionType[]
    answer:string
}

function OptionList({options,answer}:OptionListProps) {
  return (
      <>
          <ul className="w-48 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {options.map((option, index) => (
                    <li key={index} className={`${ option.option == answer ? "border-gray-200 bg-lime-600" :"border-gray-200 dark:border-gray-600"} rounded-t-lg w-full px-4 py-2 border-b`}>
                        <span className="me-2">{ option.option } )</span>
                        {option.optionValue}
                    </li>
                ))}
            </ul>
      </>
  )
}

export default OptionList