
interface UserCardProps {
  userReady: boolean
  username: string
  status:boolean
  role?: 'host' | 'player'
}


function UserCard({username,userReady,role,status}:UserCardProps) {
  return (
    <>
      <div className={`${ status ? userReady || role == 'host' ? "border-green-800" : "border-red-800" : "border-gray-700" } border-2 rounded-md bg-neutral-800 px-2 py-1`}>
            <div className="flex justify-between align-middle">
          <h4 className="text-base text-gray-300 font-semibold md:text-lg m-0">{ username && username || "Username"}</h4>
                <p className="m-0 text-sm text-gray-50">:</p>
              </div>
              <div className="flex justify-between">
          <p className="m-0 text-sm text-gray-500">{role == 'host' ? "host" : "player"}</p>
          {
            role == 'host' ?
              <p className="text-slate-300 font-medium text-sm">Host</p>
              :
              userReady ? 
                <p className="text-green-700 text-sm font-medium">Ready</p> :
                <p className="text-red-700 text-sm font-medium">Not Ready</p>
          }
                  {/* {
                    userReady ?
                      <p className="text-green-700 text-sm font-medium">Ready</p> :
                      <p className="text-red-700 text-sm font-medium">Not Ready</p>
                  } */}
              </div>
        </div>
      </>
  )
}

export default UserCard