import { Link } from "react-router-dom"

function NavLoginButton() {
  return (
      <>
          <Link to={'/login'}>
            <button className="bg-slate-950 hover:bg-slate-800 border min-w-28 font-medium px-6 py-2.5 border-slate-800 text-center text-sm text-cyan-50 rounded-lg">
              Login
            </button>
            </Link>
      </>
  )
}

export default NavLoginButton