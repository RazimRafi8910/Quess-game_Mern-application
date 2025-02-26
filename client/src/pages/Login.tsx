import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import { useState } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { loginUser } from "../store/slice/userSlice";
import getHttpErrorMessage from "../utils/getHttpErrorMessage";
import { toast } from "react-toastify";
import { setUserLocalStorage } from "../utils/localStateManager";

interface FormInputs {
  email: string,
  password: string,
}

const UserSchema = yup.object({
  email: yup.string().email().required(),
  password:yup.string().required()
})

function Login() {

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch:AppDispatch = useDispatch()

  const { handleSubmit, register, formState :{ errors} } = useForm<FormInputs>({
    resolver: yupResolver(UserSchema),
  })
  
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsLoading(true)
    try {
      const responce = await fetch('http://localhost:3001/login', {
        method: "POST",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result = await responce.json()

      if (!responce.ok) {
        throw new Error(result.message || getHttpErrorMessage(responce.status));
      }

      if (result.user) {
        const { user } = result  
        const newUser = {
          username: user.username,
          role:user.role,
          email: user.email,
          id: user.id
        }
        toast.success(result.message || "Login Success", {
          position:'top-right'
        });
        dispatch(loginUser(newUser));
        // set user details to localstorage
        setUserLocalStorage(newUser);
        navigate('/')
      }
      
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Loader/>
      </>
    )
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-4 md:px-6 py-12 lg:px-8">
        <div className="bg-slate-900/[0.2] text-white min-w-[360px] w-4/6 sm:w-3/5 md:w-3/6 lg:w-2/6 border-2 border-zinc-700 mx-auto rounded-2xl py-8 px-4 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            {/* <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          /> */}
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white-900">
              Login in to your account
            </h2>
            <p className="text-red-600 text-center text-sm md:text-lg">{ error }</p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="px-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-white-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    type="email"
                    required
                    {...register("email")}
                    className="px-2 block w-full bg-slate-950 rounded-md border-0 py-1.5 text-slate-300 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <p className="text-red-600 text-sm">{ errors?.email?.message }</p>
                </div>
              </div>

              <div className="px-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-white-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    type="password"
                    required
                    {...register("password")}
                    className="px-2 block w-full bg-slate-950 rounded-md border-0 py-1.5 text-slate-300 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <p className="text-sm text-red-600">{ errors?.password?.message }</p>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a registerd?{" "}
              <Link
                to={"/register"}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
