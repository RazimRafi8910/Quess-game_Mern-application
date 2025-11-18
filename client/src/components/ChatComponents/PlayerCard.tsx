
const cardColor = ["bg-green-", "bg-red-","bg-blue-","bg-green-","bg-slate-"]

type Prop = {
    playerName: string,
    color: number,
    role:string
}

function PlayerCard({color,playerName,role}:Prop) {
  return (
      <>
          <div className={`${cardColor[color] + "500"} w-fit min-w-30 rounded-md pe-1 my-1`}>
              <p className="text-slate-400 text-sm">{ role }</p>
              <div className="flex">
                  <p className={`${cardColor[color] + "700"} w-4 rounded-s-md me-1`}></p>
                  <p className="text-neutral-300 text-base">{playerName}</p>
              </div>
          </div>          
      </>
  )
}

export default PlayerCard