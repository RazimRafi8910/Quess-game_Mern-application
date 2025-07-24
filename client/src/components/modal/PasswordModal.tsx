import { useState } from "react"
import useFetch from "../../Hooks/useFetch"
import { toast } from "react-toastify"


interface ModalProps  {
    isOpen: boolean
    setModal: (prev:boolean) => void
    gameId: string
    roomName: string
    navigate:(val:string)=>void
}

type Response = {
    status:boolean
}

function PasswordModal({ isOpen, roomName, setModal,gameId,navigate }: ModalProps) {
    const { getFetch } = useFetch(null,false)
    const [pass, setPass] = useState('');

    const handlePasswordSubmit = async () => {
        const data = {
            password: pass,
            gameId
        }
        //api request to backend
        const result = await getFetch<Response>({ url: '/game/password', method: 'POST', body: data });
        if (result?.data?.status) {
            navigate(`/lobby/${gameId}`)
        } else {
            toast.error(result?.message)
        }
    }

    if (!isOpen) {
        return
    }
  return (
        <div id="popup-modal" tabIndex={-1} className="bg-gray-800/[0.2] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-black">
                    <button type="button" onClick={()=>{setModal(false)}} className="absolute top-3 end-2.5 text-gray-100 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-4 md:p-5 text-center">
                      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-300">{`Enter ${roomName.toUpperCase()}'s Lobby Password `}</h3>
                      <input type="text" value={pass} onChange={(e)=>{ setPass(e.target.value) }} className="rounded-s-md py-2 px-4 bg-neutral-600 border-e-0 border text-white focus:border-0 border-slate-100" />
                        <button data-modal-hide="popup-modal" onClick={handlePasswordSubmit} type="button" className="text-white border-s-0 border bg-black hover:bg-slate-800  border-slate-100 focus:ring-4 focus:outline-none focus:ring-slate-300  font-medium rounded-e-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                            Enter
                        </button>
                        {/* <button data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">cancel</button> */}
                    </div>
                </div>
            </div>
        </div>
  )
}

export default PasswordModal