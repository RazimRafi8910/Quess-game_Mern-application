import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../../store/store.js";
import UserButton from "../Buttons/UserButton.js";
import NavLoginButton from "../Buttons/NavLoginButton.js";

function Navbar() {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    
  }
  const userState = useSelector((state:RootState) => state.userReducer.logined)
  return (
    <>
      <div className=" mx-auto w-full bg-black-900 text-white">
        <div className="flex justify-between mx-10 lg:mx-28 py-2">
          <div className="font-bold flex ">
            <Link to={'/'}>
              <h1 className="align-middle py-3 font-mono sm:text-sm lg:text-2xl">Quess Game</h1>
            </Link>
          </div>
          <div>
            { userState ? <UserButton/> : <NavLoginButton/> }
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
