import { memo, useEffect, useRef, useState } from "react";
import InputForm from "../InputForm";
import { useForm,SubmitHandler } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import { getLocalStorageItem } from "../../utils/localStateManager";
import { useDispatch } from "react-redux";
import { setGameState } from "../../store/slice/gameSlice";

interface ModalProps {
  isOpen: boolean;
  setModal: (val: boolean) => void;
}

type GameStateResponce = {
  gameId: string
  playerId:string
}

interface FormContextValue {
  showPassword: boolean;
}

export interface RoomTypes {
  roomName: string;
  noPlayers: number;
  password?: string | null;
  category: string;
}

const InputSchema = yup.object({
  roomName: yup.string().required("Room name is a required Field"),
  noPlayers: yup.number().required("Number of players is required"),
  category: yup.string().required("please select the Category of the Quiz"),
  password: yup.string().notRequired().test('password-validate', 'password must be 3 letter',
    function (value) {
      const { showPassword } = this.options.context as FormContextValue;
      if (!showPassword) return true;
      if (value) {
        return value.length > 3
      }
    }
  ),
})

function CreateGameModal({ isOpen, setModal }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch()

  const { getFetch } = useFetch('', false);

  const { handleSubmit, register, reset, formState: { errors } } = useForm<RoomTypes>({
    resolver: yupResolver(InputSchema),
    defaultValues: {
      roomName: '',
      noPlayers: 2,
      password: null,
      category: '',
    },
    context:{showPassword},
    mode:'onBlur'
  });

  const handleCloseModal = () => {
    setModal(false);
    reset();
  }

  useEffect(() => {
    if (!isOpen) return;

    const handleCloseOnMouse = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal()
      }
    };

    document.addEventListener("mousedown", handleCloseOnMouse);
    return () => {
      document.removeEventListener("mousedown", handleCloseOnMouse);
    };
  }, [isOpen]);

  const onCreate: SubmitHandler<RoomTypes> = async (data) => {
    const requestData = {
      ...data,
      havePassword:showPassword,
      hostName: getLocalStorageItem<string>('username'),
    }
    
    //create game request to backend
    const result = await getFetch<GameStateResponce>({ url: '/game/create', method: "POST", body: requestData });
    if (result !== undefined && result.success) {
      reset();
      console.log(result.data)
      dispatch(setGameState(result.data?.gameId));
      
      navigate(`/lobby/${result.data?.gameId}`)
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 z-10  bg-gray-800/50 flex items-center justify-center"
        role="dialog"
        aria-modal="false"
        aria-labelledby="modal-title"
      >
        {/* Modal Content */}
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-black text-left shadow-xl transition-all sm:my-8 w-full mx-2 md:mx-0 max-w-lg"
        >
          <form onSubmit={handleSubmit(onCreate)}>
          {/* Modal Header and Content */}
          <div className="bg-black/75 px-4 pt-5 pb-4 sm:p-6">
            <div className="">
              <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                <h2 className="text-lg font-semibold text-gray-200" id="modal-title">Create Room</h2>
                <div className="">
                  <p className="text-sm text-gray-400">
                    Create a Room and Invite your Frients
                  </p>
                </div>
                {/* from */}
                <div className="mt-2">
                  <InputForm htmlLabel="Room name" label="roomName" inputType="text" placeholder="Room name" inputError={errors.roomName} register={register} required={true}  />
                  

                  <div className="mb-2">
                      <label className="block my-1 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                      <select {...register("category")} className="bg-gray-800/[0.5] border-gray-300 text-gray-900 test-sm rounded-lg block w-full dark:text-gray-50 p-2">
                        <option value={""} className="bg-gray-800" defaultValue={""} hidden>Select the Options</option>
                        <option className="bg-gray-800" value={"IT"}>IT</option>
                        <option className="bg-gray-800" value={"programming"}>Programming</option>
                        <option className="bg-gray-800" value={"general"}>General</option>
                        <option className="bg-gray-800" value={"history"}>history</option>
                      </select>
                      {errors.category && <p className="text-red-500">{ errors.category.message }</p>}
                    </div>

                    { showPassword && <InputForm htmlLabel="Password" label="password" inputType="text" placeholder="password" inputError={errors.password} register={register} required={true} /> }

                  <div className="mb-2 mt-3">                    
                      <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" onChange={()=>{ setShowPassword(!showPassword) }} className="sr-only peer"/>
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Password</span>
                      </label>
                    </div>
                    
                  <div className="mb-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">No. Players</label>
                    <select
                      id="countries"
                      {...register('noPlayers',{required:true})}
                      className="bg-gray-800/[0.5] border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block max-w-full min-w-40 p-2 dark:bg-gray-800/[0.5] dark:border-gray-600 dark:placeholder-gray-800 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                      <option value={2} defaultValue={2}>2</option>
                      <option value={4}>4</option>
                      <option value={6}>6</option>
                      </select>
                      {errors.noPlayers && <p className="text-red-500">{ errors.noPlayers.message }</p>}
                    </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-black/75 px-4 py-3 flex flex-row-reverse sm:px-6">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md mx-1 bg-indigo-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-700 w-auto mt-3"
              >
              Create
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
              className="mt-3 inline-flex justify-center rounded-md mx-1 bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-red-400 "
              >
              Cancle
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

export default memo(CreateGameModal);
