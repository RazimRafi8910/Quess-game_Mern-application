import { memo, useEffect, useRef, useState } from "react";
import InputForm from "../InputForm";
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/useFetch";
import { getLocalStorageItem, setLocalStorageItem } from "../../utils/localStateManager";
import { useDispatch, useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { useOutletContext } from "react-router-dom";
import { setGameState } from "../../store/slice/gameSlice";
import Loader from "../Loader";
import { RootState } from "../../store/store";

interface ModalProps {
  isOpen: boolean;
  setModal: (val: boolean) => void;
}

type GameStateResponce = {
  gameId: string
  playerId: string
}

type CategoryType = {
  categoryName: string;
}

interface FormContextValue {
  showPassword: boolean;
}

export interface RoomTypes {
  roomName: string;
  noPlayers: number;
  aiQuestion?: string | null;
  password?: string | null;
  category: string;
}

const InputSchema = yup.object({
  roomName: yup.string().required("Room name is a required Field"),
  noPlayers: yup.number().required("Number of players is required"),
  category: yup.string().required("please select the Category of the Quiz"),
  aiQuestion: yup.string().nullable(),
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
  const socket = useOutletContext<Socket | null>()
  const user = useSelector((state: RootState) => state.userReducer.user);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch()

  const { data: category, loading, error, getFetch } = useFetch<CategoryType[]>('/game/categorys');

  const { handleSubmit, register, reset, formState: { errors } } = useForm<RoomTypes>({
    resolver: yupResolver(InputSchema),
    defaultValues: {
      roomName: '',
      noPlayers: 2,
      password: null,
      category: '',
      aiQuestion: null,
    },
    context: { showPassword },
    mode: 'onBlur'
  });

  const handleCloseModal = () => {
    setModal(false);
    reset();
  }

  useEffect(() => {
    if (!isOpen) return;
    console.log(user)
    const handleCloseOnMouse = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        handleCloseModal()
      }
    };
    console.log(user)
    document.addEventListener("mousedown", handleCloseOnMouse);
    return () => {
      document.removeEventListener("mousedown", handleCloseOnMouse);
    };
  }, [isOpen]);

  const onCreate: SubmitHandler<RoomTypes> = async (data) => {
    const requestData = {
      ...data,
      havePassword: showPassword,
      aiQuestion: data.aiQuestion == "true",
      hostName: getLocalStorageItem<string>('username'),
      hostSocketId: socket?.id || null,
    }
    console.log(requestData)

    //create game request to backend
    const result = await getFetch<GameStateResponce>({ url: '/game/create', method: "POST", body: requestData });
    if (result !== undefined && result.success) {
      reset();
      setLocalStorageItem('gameId', result.data?.gameId);
      console.log(window.localStorage.getItem('gameId'));
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
          className="relative transform overflow-hidden rounded-2xl bg-black text-left shadow-xl transition-all sm:my-8 w-full mx-2 md:mx-0 max-w-lg"
        >
          <form onSubmit={handleSubmit(onCreate)}>
            {/* Modal Header and Content */}
            <div className="bg-black/75 px-4 pt-5 pb-4 sm:p-6">
              <div className="">
                <div className="mt-3 sm:mt-0 sm:ml-4 text-left">
                  <h2 className="text-2xl font-semibold text-gray-200" id="modal-title">Create Room</h2>
                  <div className="">
                    <p className="text-sm ms-1 text-gray-400">
                      Create a Room and Invite your Frients
                    </p>
                  </div>
                  {/* from */}
                  <div className="mt-3">
                    <InputForm htmlLabel="Room name" label="roomName" inputType="text" placeholder="Room name" inputError={errors.roomName} register={register} required={true} />


                    {loading ?
                      <Loader />
                      :
                      <div className="mb-2">
                        <label className="block my-1 text-sm font-medium text-gray-900 dark:text-white">Category</label>
                        <select
                          {...register("category")}
                          className="bg-gray-900 border border-gray-700 text-gray-100 text-sm rounded-lg block w-full p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={""} className="bg-gray-800" defaultValue={""} hidden>Select the Options</option>
                          {
                            category?.map((item, index) => (
                              <option className="bg-gray-800" key={index} value={item.categoryName}>{item.categoryName}</option>
                            ))
                          }
                        </select>
                        {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                        {error && <p className="text-red-500">{error}</p>}
                      </div>
                    }


                    <div className="mb-2 mt-2">
                      <label className="flex justify-between cursor-pointer">
                        <input type="checkbox" value="" onChange={() => { setShowPassword(!showPassword) }} className="sr-only peer" />
                        <label className="block my-1 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {showPassword && <InputForm htmlLabel="" label="password" inputType="text" placeholder="password" inputError={errors.password} register={register} required={true} />}

                    {/* AI questino input */}
                    <div className="mb-2 mt-2 relative group">
                      <label className="flex justify-between cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={!user?.permission.aiAccess}
                          {...register('aiQuestion')}
                          onChange={(e) => { console.log(e.target.value) }}
                          className="sr-only peer"
                        />
                        <label className={`block my-1 text-sm font-medium ${user?.permission.aiAccess ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-500"}`}>
                          AI Questions <i className="fa-light fa-circle-info"></i>
                        </label>
                        <div className={`relative w-11 h-6 peer-focus:outline-none rounded-full bg-gray-200 peer ${user?.permission.aiAccess ? "dark:bg-gray-700" : "bg-gray-200 dark:bg-gray-800"} peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] ${user?.permission.aiAccess ? "after:bg-white after:border-gray-700" : "after:bg-gray-600 after:border-gray-700"} after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600`}></div>
                      </label>
                      <div className="absolute left-0 top-full mt-1 hidden group-hover:block rounded-md bg-gray-800 text-xs text-gray-100 px-2 py-1 shadow-lg z-20">
                        {user?.permission.aiAccess ? "Enable AI-generated questions for this room." : "Get pro plan to access AI-generated questions"}
                      </div>
                    </div>

                    <div className="mb-2 flex justify-between">
                      <label className="block mb-2 mt-1 text-sm font-medium text-gray-900 dark:text-white">No. Players</label>
                      <select
                        id="countries"
                        {...register('noPlayers', { required: true })}
                        className="bg-gray-900 border border-gray-700 text-gray-100 text-sm rounded-lg block max-w-full min-w-20 p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value={2} defaultValue={2}>2</option>
                        <option value={4}>4</option>
                        <option value={6}>6</option>
                      </select>
                      {errors.noPlayers && <p className="text-red-500">{errors.noPlayers.message}</p>}
                    </div>

                    <div className="mb-2 flex justify-between">
                      <label className="block mb-2 mt-1 text-sm font-medium text-gray-900 dark:text-white">Game visibility</label>
                      <select
                        className="bg-gray-900 border border-gray-700 text-gray-100 text-sm rounded-lg block max-w-full min-w-20 p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </div>


                    {/* <div className="mb-2 mt-2">
                      <label className="min-w-max">
                        <label className="block my-1 text-sm font-medium text-gray-900 dark:text-white">Difficulty level</label>
                        <input type="range" value="" onChange={() => { console.log("ai clicked") }} className="w-full h-2 bg-gray-500 rounded-lg appearance-none cursor-pointer" style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(1 / 2) * 100}%, #e5e7eb ${(1 / 2) * 100}%, #e5e7eb 100%)`
                        }} />
                        {/* <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div> */}
                    {/* </label> */}
                    {/* <div className="flex justify-between mt-1 px-1">
                      <span className={`text-sm font-medium text-gray-500`}>
                        Easy
                      </span>
                      <span className={`text-sm font-medium text-gray-500`}>
                        Medium
                      </span>
                      <span className={`text-sm font-medium text-gray-500`}>
                        Hard
                      </span>
                      </div> 
                  </div>*/}




                    {/* end of modal body container */}

                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-black/75 px-4 py-3 flex flex-row-reverse sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md mx-1 bg-gray-200 px-3 py-2 text-sm font-semibold ring-1 ring-gray-500 text-gray-800 shadow-xs hover:bg-green-700 w-auto mt-3"
              >
                Create
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="mt-3 inline-flex justify-center rounded-md mx-1 bg-neutral-950 px-3 py-2 text-sm font-semibold text-white ring-1 shadow-xs ring-gray-800 ring-inset w-auto hover:bg-red-400 "
              >
                Cancle
              </button>
            </div>
          </form>
        </div >
      </div >
    </>
  );
}

export default memo(CreateGameModal);
