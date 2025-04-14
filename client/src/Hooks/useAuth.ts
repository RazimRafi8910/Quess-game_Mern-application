import { useEffect, useRef, useState } from "react";
import { loginUser,UserState } from "../store/slice/userSlice"
import getHttpErrorMessage from "../utils/getHttpErrorMessage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";


interface AuthReturn {
    user: UserState | null;
    loading: boolean;
    error: string | null;
}

export default function useAuth() : AuthReturn {
    const userState = useSelector((state: RootState) => state.userReducer);
    const [user, setUser] = useState<UserState | null>(userState);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>('');
    const dispatch = useDispatch();
    const hasFetch = useRef(false);

    const getUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/user', {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
                credentials: 'include',
            });
            
            const result = await response.json();
            if (!response.ok) {
                localStorage.removeItem('username');
                localStorage.removeItem('email');
                throw new Error(result.message || getHttpErrorMessage(response.status));
            }

            if (result.success) {
                const { userDetails: responseUser } = result;
                dispatch(loginUser(responseUser));
                const stateUser = {
                    user: responseUser,
                    logined: true
                }
                setUser(stateUser);
            }

        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("something went wrong");
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const userExists = window.localStorage.getItem('username');
        if (userState.logined == false && userExists && !hasFetch.current) {
            hasFetch.current = true;
            getUserData()
        } else {
            setLoading(false)
        }
        console.log("called auth hook");
    }, [userState.logined]);
   
    return { user,loading,error }
}
