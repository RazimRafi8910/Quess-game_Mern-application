import useFetch from "../../Hooks/useFetch"
import Loader from "../Loader";
import { QuestionType,CategorysType } from "../../types";
import OptionList from "./OptionList";
import { useState } from "react";

function QuestionDiv() {
    const { data: quesions, loading: questionLoading, error: questionError, getFetch, refresh } = useFetch<QuestionType[]>('/admin/question');
    const { data: categorys, loading: categoryLoading, error: categoryError } = useFetch<CategorysType[]>('/admin/category');
    const [showDelete, setShowDelete] = useState<number | null>(null);

    
    const handleDeleteQuestion = async (id: string) => {
        const result = await getFetch({
            url: `/admin/question/${id}/delete`,
            method: 'DELETE',
        });
        console.log(result);
        if (result?.success) {
            refresh()
        }
        setShowDelete(null);
    }

    if (categoryLoading || questionLoading) {
        return (
            <Loader/>
        )
    }
    // if (questionError) {
    //     return (
    //         <>
                
    //         </>
    //     )
    // }
    return (
        <>
            <div className="container">
                <div className="text-center py-5">
                    <h2 className="text-3xl font-bold underline text-slate-200">Questions</h2>
                    { questionError && <p className="text-red-500 text-center pt-4">{ questionError}</p> }
                </div>
            </div>
            <div className="flex justify-center">
                <div className="mb-3 w-1/2 mt-2 flex">
                    <label htmlFor="" className="w-1/4 text-xl text-white me-2">Category</label>
                    {
                        categoryError ? <p className="text-red-500">{ categoryError }</p> :
                        <select className="bg-slate-500 w-3/4 px-3 py-1 border border-slate-300 text-neutral-200 rounded-md" name="" id="">
                            {categorys?.map((item, index) => (
                                <option key={index} value={item._id}>{ item.categoryName }</option>
                            ))}
                        </select>
                    }
                </div>
            </div>
            <div className="md:mx-10 my-3">
                <hr className="border-neutral-500" />
            </div>
            {quesions && quesions.length < 1 && <p className="text-center text-white pt-5">No Qeustion found</p>}
            <div className="flex flex-row flex-wrap md:mx-6">
                {
                    quesions && quesions.map((item, index) => (
                        <div className="w-full md:w-3/6 lg:w-2/6 p-1" key={index}>
                            <div className="rounded-lg h-full bg-slate-950/[0.5] border border-slate-400">
                                <div className="text-stone-300 px-4 py-3">
                                    <div>
                                        <h4 className="text-neutral-500">{ item.category }</h4>
                                        <h3 className="text-xl">Q:{item.question}</h3>
                                    </div>
                                    <div className="mt-2">
                                        <p className="text-xl text-stone-400">Options</p>
                                        <hr className="border-neutral-500" />
                                        <OptionList answer={item.answer} options={item.options} />
                                    </div>
                                    <hr className="border-neutral-500 mt-2" />
                                    {
                                        showDelete == index ? 
                                            <div className="mt-2 flex gap-1 justify-end mx-4">
                                                <p className="me-3">Do want to delete?</p>
                                                <button type="button" onClick={()=>{handleDeleteQuestion(item._id)}} className="bg-red-900 rounded-md px-3 py-1 border border-white text-red-100">Delete</button>
                                                <button type="button" onClick={()=>{setShowDelete(null)}} className="bg-neutral-400 rounded-md px-3 py-1 border border-slate-900 text-slate-800">cancel</button>
                                            </div>
                                            :
                                            <div className="mt-2 flex justify-end mx-4">
                                                <button type="button" onClick={()=>{setShowDelete(index)}} className="bg-red-900 rounded-md px-3 py-1 text-red-100"><i className="fa-solid fa-trash"></i></button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default QuestionDiv