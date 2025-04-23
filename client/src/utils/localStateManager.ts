import { UserData } from "../store/slice/userSlice";


export function setUserLocalStorage(user : UserData) {
    try {
        window.localStorage.setItem('username', user.username);
        window.localStorage.setItem('email', user.email);
    } catch (error) {
        console.log(error);
    }
}

export function setLocalStorageItem(key:string,data:any) {
    try {
        window.localStorage.setItem(key, data);
    } catch (error) {
        console.log(error)
        return false
    }
}

export function getLocalStorageItem<T>(key: string): T | null{
    try {
        return window.localStorage.getItem(key) as T;
    } catch (error) {
        console.log(error)
        return null
    }
}

export function removeLocalStorageItem(key:string): boolean{
    try {
        window.localStorage.removeItem(key)
        return true
    } catch (error) {
        console.log(error)
        return false
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