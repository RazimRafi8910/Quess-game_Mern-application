

const cardColor = ["bg-lime-", "bg-red-","bg-blue-","bg-green-","bg-slate-"]

function PlayerCard({color}:{color:number}) {
  return (
      <>
          <div className={`${cardColor[color]+"500"} w-fit min-w-30 rounded-md pe-1 my-1`}>
              <div className="flex">
                  <p className={`${cardColor[color]}900 w-4 rounded-s-md me-1`}></p>
                  <p className="text-neutral-300">playerName</p>
              </div>
          </div>          
      </>
  )
}

export default PlayerCard