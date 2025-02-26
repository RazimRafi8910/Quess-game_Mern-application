
interface UserCardProps {
  userReady?: boolean
  username?: string
  rank?: number
}


function UserCard({username,userReady,rank}:UserCardProps) {
  return (
      <>
        <div className="border-slate-800 rounded-md bg-gray-700 px-2 py-1">
            <div className="flex justify-between align-middle">
          <h4 className="text-base text-gray-300 font-semibold md:text-lg m-0">{ username && username || "Username"}</h4>
                <p className="m-0 text-sm text-gray-50">:</p>
              </div>
              <div className="flex justify-between">
                <p className="m-0 text-sm text-gray-500">Rank:{ rank && rank || "20" }</p>
                  {
                    userReady ?
                      <p className="text-green-700 text-sm font-medium">Ready</p> :
                      <p className="text-red-700 text-sm font-medium">Not Ready</p>
                  }
              </div>
        </div>
      </>
  )
}

export default UserCard