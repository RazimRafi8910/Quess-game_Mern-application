function AnswerIndicator() {
  return (
    <>
      <div className="container ms-auto">
        <div className="mt-5 flex justify-center items-center">

          <div className="mx-1">
          <input type="radio" className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-500" />
          </div>

          <div className="mx-1">
          <input type="radio" className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-500" />
          </div>

          <div className="mx-1">
          <input type="radio" className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-500" />
          </div>

          <div className="mx-1o">
          <input type="radio" className="appearance-none w-6 h-6 border border-gray-300 rounded-full checked:bg-blue-500" />
          </div>

        </div>

      </div>
    </>
  );
}

export default AnswerIndicator;


{/* <div className="inline-flex items-center">
            <label
              className="relative flex items-center cursor-pointer"
              htmlFor="slate-800"
            >
              <input
                name="color"
                type="radio"
                className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-slate-400 transition-all"
                id="slate-800"
                readOnly
              />
              <span className="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
            </label>
          </div> */}