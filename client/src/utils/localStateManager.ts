import { UserData } from "../store/slice/userSlice";


export function setUserLocalStorage(user : UserData) {
    try {
        window.localStorage.setItem('username', user.username);
        window.localStorage.setItem('email', user.email);
    } catch (error) {
        console.log(error);
    }
}

export function removeUserLocalStorage(): boolean {
    try {
        window.localStorage.removeItem('username');
        window.localStorage.removeItem('email');
        return true
    } catch (error) {
        console.log(error);
        return false
    }
}