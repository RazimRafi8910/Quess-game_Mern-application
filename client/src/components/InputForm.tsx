import { UseFormRegister, FieldError } from "react-hook-form";
import { RoomTypes } from "./modal/CreateGameModal";

type InputFormProps = {
    inputType: string;
    inputError?: FieldError;
    label: keyof RoomTypes;
    htmlLabel?: string;
    placeholder: string;
    required?: boolean;
    register: UseFormRegister<RoomTypes>;
};

const InputForm:React.FC<InputFormProps> = ({ inputType, htmlLabel, inputError, label, placeholder, register, required }) => {
    return (
        <>
              <div className="mb-2">
                  <label className="block my-1 text-sm font-medium text-gray-900 dark:text-white">
                      {htmlLabel}
                  </label>
                  <input
                      type={inputType}
                      className={`bg-gray-50 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-800/[0.5]  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500
                        ${inputError ? "border-red-500 border-2" : "border-gray-300 dark:border-gray-600 dark:placeholder-gray-400"} `
                      }
                      placeholder={placeholder}
                      {...register(label)}
                      required={required}
                  />
                  {inputError && <p className="text-red-500 text-sm">{ inputError.message }</p>}
              </div>
          </>
      );
}

export default InputForm;
