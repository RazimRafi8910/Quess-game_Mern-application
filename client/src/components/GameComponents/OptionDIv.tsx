
type PropType = {
    selectedOption:string
    optionFunc: Function
    option: string
    optionValue:string
}

function OptionDIv({option,optionValue,selectedOption,optionFunc}:PropType) {
    const handleClick = () => {
        optionFunc(option)
    }
  return (
      <>
          <div onClick={handleClick} >
                <div className="my-1 flex border-[2px] bg-gray-600/[.5] border-gray-600 rounded-r-lg">
                  <h5 className="border-r-2 p-2">{ option }</h5>
                    <div className="w-full">
                      <div className={`flex py-2 px-3 ${selectedOption == option ? "bg-neutral-400 text-black" : "bg-zinc-700"  } border-gray-600 rounded-r-lg`}>
                          <p className="mx-3">{ optionValue }</p>
                        </div>
                    </div>
                </div>
          </div>
      </>
  )
}

export default OptionDIv