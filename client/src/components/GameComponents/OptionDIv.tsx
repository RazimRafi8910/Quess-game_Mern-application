
interface OptionDivProps {
  option: string;
  optionValue: string;
  currentSelectOption: string | null;
  handleSelect:(option:string)=>void
}


function OptionDIv({option,optionValue,currentSelectOption,handleSelect}:OptionDivProps) {
  return (
      <>
          <div className="" onClick={()=>{handleSelect(option)}}>
                <div className="my-1 flex border-[2px] border-gray-600 rounded-lg">
                    <h5 className="border-r-2 p-2 text-slate-300 bg-neutral-700">{ option }</h5>
                    <div className="w-full">
                      <div className={`flex py-2 px-3 ${ currentSelectOption === option ? "bg-neutral-400 text-black" : "bg-gray-900/[0.5] text-slate-300"  } border-gray-700 rounded-r-lg`}>
                          <p className="mx-3">{ optionValue }</p>
                        </div>
                    </div>
                </div>
          </div>
      </>
  )
}

export default OptionDIv