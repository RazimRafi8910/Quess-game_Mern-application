import { useState } from "react"
import { useForm } from 'react-hook-form'
import Loader from "../Loader"
import useFetch from "../../Hooks/useFetch"
import { CategorysType } from "../../types"

type OptionType = {
    option: string
    optionValue:string
}

interface FormInput {
    question: string
    options: OptionType[]
    answer: string
    category:string
}

function QuestionForm() {
    const OPTIONS = ["A", "B", "C", "D"]
    const [answer, setAnswer] = useState<string>('')
    const { data:categorys, loading, error, getFetch } = useFetch<CategorysType[]>('/admin/category');

    const { handleSubmit, register,reset, formState: { errors } } = useForm<FormInput>({
        defaultValues: {
            question: "",
            options: [],
            answer: '',
            category:''
        }
    })

    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setAnswer(event.currentTarget.value)
    }

    const onSubmit = async (data:FormInput) => {
        const result = await getFetch({ url: '/admin/question/create', method: 'POST', body: data });
        if (result?.success) {
            reset();
        }
    }

    if (loading) {
        return (
            <>
                <Loader/>
            </>
        )
    }

    return (
        <>
            <div>
                <div className="text-center text-slate-300 pt-3 mb-3">
                    <h2 className="text-3xl font-bold underline">Create Question</h2>
                    <p className="text-red-500">{error}</p>
                </div>
                <div className="">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
                        <div>
                            <label htmlFor="message" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Question</label>
                            <textarea
                                id="message"
                                rows={4}
                                {...register("question")}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Enter the question...">
                            </textarea>
                            <p className="text-red-500">{ errors.question?.message }</p>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="countries" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Select category</label>
                            <select id="countries" {...register('category')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {categorys && categorys.map((item, index) => (
                                    <option key={index} value={item._id}>{ item.categoryName }</option>
                                ))};
                            </select> 
                            <p className="text-red-500 text-lg">{errors.answer?.message}</p>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="website-admin" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Options</label>
                            {OPTIONS.map((element,index) => (
                                <div key={index} className="flex">
                                    <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-e-0 border-gray-300  dark:bg-gray-600 dark:text-slate-200 dark:border-gray-600">
                                        {element}
                                    </span>
                                    <input type="text" {...register(`options.${index}.option`)} value={element} readOnly hidden />
                                    <input type="text" {...register(`options.${index}.optionValue`)} className={`rounded-nonerounded-e-lg ${answer === element ? "dark:bg-green-700" : "dark:bg-red-900"}  bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                        placeholder={`option  ${element}`} />
                                </div>
                            ))}
                            <p className="text-red-500">{ errors.options?.message }</p>
                        </div>

                        <div className="mt-4">
                            <label htmlFor="countries" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Select correct answer</label>
                            <select id="countries" {...register('answer')} onChange={(e) => { handleSelect(e) }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                {OPTIONS.map((element,index) => (
                                    <option key={index} value={element}>{element}</option>
                                ))}
                            </select> 
                            <p className="text-red-500 text-lg">{errors.answer?.message}</p>
                        </div>

                        <div className="mt-4 flex justify-center mx-auto">
                            <div className="">
                                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-8 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default QuestionForm