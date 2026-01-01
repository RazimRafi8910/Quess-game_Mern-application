import { useEffect, useState } from "react"
import { GameStateType } from "../../types"
import { useNavigate } from "react-router-dom"


type Props = {
    isOpen: boolean
    gameId:string | undefined
    timeTaken: (()=> number) | undefined
    gameState: GameStateType
    questionLen: number
    questionAttented: number
    handleModalClose: (a: boolean) => void
    handleSubmit:() => void
}

function SubmitModal({ isOpen,gameId, handleModalClose, handleSubmit, timeTaken, gameState, questionLen, questionAttented }: Props) {    
    const remaining = timeTaken != undefined ? timeTaken() : 0;
    const [navigateTimer, setNavigateTimer] = useState(5000);
    let timerIntervel: number;

    useEffect(() => {
        if (gameState == GameStateType.FINISHED) {
            clearInterval(timerIntervel);
            timerIntervel = setInterval(() => {
                setNavigateTimer((prev) => {
                    if (prev <= 0) {
                        clearInterval(timerIntervel);
                        handleSubmit()
                    }
                    return prev - 1000
                })
            }, 1000);
        }
        return () => clearInterval(timerIntervel);
    },[gameState])

    if (!isOpen) {
        return <></>
    }
    return (
        <>
            <div id="popup-modal" tabIndex={-1} className="bg-gray-950/[0.5] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                    <div className="relative p-4 w-full max-w-md max-h-full">
                        <div className="relative bg-white rounded-lg shadow-sm border border-neutral-600 dark:bg-gray-950">
                            <button type="button" onClick={()=>{handleModalClose(false)}} className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <div className="p-4 md:p-5">
                            <h3 className="mb-5 text-lg text-center font-normal text-gray-500 dark:text-gray-300">Submit</h3>
                            <div className="text-white">
                                <h4>Number of quesitons</h4>
                                <p className="text-gray-400">{ questionLen }</p>
                                <h4>Questions attended</h4>
                                <p className="text-gray-400">{ questionAttented }</p>
                                <h4>Time taken</h4>
                                <p className="text-gray-400">{ Math.floor(remaining / 60)  + ":" + remaining%60  }</p>
                            </div>
                            {
                                gameState == GameStateType.RUNNING ? 
                                    <button onClick={handleSubmit} data-modal-hide="popup-modal" type="button" className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                                    Submit
                                    </button>
                                    :
                                    <p className="text-gray-500 mt-2">results in { navigateTimer }</p>
                            }
                            {
                                gameState == GameStateType.RUNNING &&
                                <button data-modal-hide="popup-modal" onClick={() => { handleModalClose(false) }} type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">cancel</button>
                            }
                            </div>
                        </div>
                    </div>
                </div>
        </>
  )
}

export default SubmitModal