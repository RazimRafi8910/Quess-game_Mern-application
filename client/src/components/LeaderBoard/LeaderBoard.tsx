function LeaderBoard() {
  return (
    <>
      <div className="relative overflow-x-auto w-full flex justify-center">
        <table className="w-3/5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-transparent-50 dark:bg-transparent-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Player Name
              </th>
              <th scope="col" className="px-6 py-3">
                Position
              </th>
              <th scope="col" className="px-6 py-3">
                Match won
              </th>
              <th scope="col" className="px-6 py-3">
                Match Played
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-transparent border-b dark:bg-gray-800/5 border dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Razim Rafi
              </th>
              <td className="px-6 py-4">1</td>
              <td className="px-6 py-4">400</td>
              <td className="px-6 py-4">432</td>
            </tr>
            <tr className="bg-transparent border-b dark:bg-gray-800/5 border dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Peter Parker
              </th>
              <td className="px-6 py-4">2</td>
              <td className="px-6 py-4">363</td>
              <td className="px-6 py-4">392</td>
            </tr>
            <tr className="bg-transparent border-b dark:bg-gray-800/5 border dark:border-gray-700">
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                Patrick
              </th>
              <td className="px-6 py-4">3</td>
              <td className="px-6 py-4">311</td>
              <td className="px-6 py-4">452</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LeaderBoard;
