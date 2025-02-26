import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import getBackendURL from "../../utils/getBackend"
import getHttpErrorMessage from "../../utils/getHttpErrorMessage"
import { toast } from "react-toastify"
import { removeUserLocalStorage } from "../../utils/localStateManager"
import { logoutUser } from "../../store/slice/userSlice"

const API = getBackendURL();

function UserButton() {
    const [drop, setDrop] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.userReducer.user)
    const dropDown = () => {
        setDrop(prev => !prev)
    }

    // PENDING: LOGOUT
    const handleLogout = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${API}/user/logout`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include'
            });
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || getHttpErrorMessage(response.status));
            }
            if (!result.success) {
                toast.error(result.message);
                setIsLoading(false)
                return
            }

            // logout user from local storage and state
            removeUserLocalStorage();
            dispatch(logoutUser());
            navigate('/login');

        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                toast.error(error.message)
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="text-center items-center">
                <button onClick={dropDown} className="text-white min-w-28 border-cyan-50 hover:bg-slate-800 bg-slate-950 focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb- ">
                    {/* <div className="border me-2 px-1.5 align-middle border-white rounded-full">
                    </div> */}
                    {user && 'username' in user ? user.username : 'Guest'} {' '}
                        <i className="fa-solid fa-user ms-2 text-sm"></i>
                </button>
                {
                    drop &&
                    <div className="bg-slate-900 focus:ring-4 rounded min-w-28 px-7 py-2 absolute border border-gray-600">
                            {
                                user?.role == 'admin' &&
                                <div className="mb-2 text-white hover:text-slate-300 font-bold">
                                    <Link to={'/admin'}>
                                        <button>Admin</button>
                                        </Link>
                                </div>
                            }
                        <div className="mb-2 text-slate-200 hover:text-slate-400 font-bold">
                            <Link to={'/'}><button >Profile</button></Link>
                        </div>
                        <div className="mb-2 text-red-600 hover:text-red-400 font-bold">
                                {
                                    isLoading ? <button type="button">loging out...</button> : <button onClick={handleLogout} >logout</button>
                                }
                            </div>
                    </div>
                }
            </div>
        </>
    )
}

export default UserButton