
type ErrorModalArgs = {
  setToggle: Function
  data:string | null
}

function ErrorModal({setToggle,data}:ErrorModalArgs) {
    const handleClick = () => {
        setToggle(false)
    }
  return (
    <>  
      <div
        className="fixed z-10 overflow-y-auto top-0 w-full left-0"
        id="modal"
      >
        <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity">
            <div className="absolute inset-0 bg-gray-900 opacity-75" />
          </div>
          <span className=" sm:inline-block sm:align-middle sm:h-screen">
            
          </span>
          <div
            className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <p className="text-gray-600 text-end me-8 text-2xl font-semibold">x</p>
            <div className="bg-gray-200 px-4 py-6 text-right flex flex-col items-center">
              <h1 className="text-center text-2xl font-semibold text-red-500">{ data || "something wend wrong" }</h1>
              <button
                type="button"
                className="py-2 px-4 bg-blue-500 text-white rounded text-center mt-7 hover:bg-gray-700 mr-2"
                onClick={handleClick}              
              >
                <i className="fas fa-times"></i> Cancel
              </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorModal;
