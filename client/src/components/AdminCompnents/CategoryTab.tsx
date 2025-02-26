import { useForm } from "react-hook-form";
import useFetch from "../../Hooks/useFetch";
import Loader from "../Loader";
import { CategorysType } from "../../types";

type CategoryInputType = {
    categoryName:string
}

function CategoryTab() {
    const { data: category, loading, error, refresh, getPostRequest,getFetch } = useFetch<CategorysType[]>('/admin/category');
    const { register, handleSubmit, formState: { errors } } = useForm<CategoryInputType>({
        defaultValues: {
            categoryName:''
        }
    });

    const createCategory = async(data:CategoryInputType)=>{
        const result = await getPostRequest<CategoryInputType>('/admin/category/create', data);
        console.log(result?.success)
        if (result?.success) {
            // if category created then refreash to update category state
            refresh()
        }
    }

    const handleDelete = async (id:string)=>{
        const result = await getFetch({ url: `/admin/category/${id}/delete`, method: 'delete' });
        if (result?.success) {
            refresh();
        }
    }

  return (
      <>
          <div className="container">
              <div className="text-center py-3">
                  <h2 className="text-3xl font-bold underline text-slate-200">Categorys</h2>
                  <p className="text-red-500">{error}</p>
                  <p className="text-slate-300">TODO:Add modal for delete</p>
              </div>
              <div className="">
                <form onSubmit={handleSubmit(createCategory)} className="w-full flex justify-center items-center">
                    <div className="w-1/2">
                        <label htmlFor="message" className="block mb-2 text-lg font-medium text-gray-900 dark:text-white">Category Name</label>
                          <div className="flex">
                              <input
                                  {...register('categoryName')}
                                  id="message"
                                  className="block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-s-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                  placeholder="Enter the question..." />
                                <button type="submit" className="bg-blue-600 px-4 rounded-e-md hover:bg-blue-700 text-white py-2">Add</button>
                            </div>
                          <p className="text-red-500">{ errors.categoryName?.message }</p>
                          
                      </div>
                      <div className="flex justify-center mt-3">
                          </div>
                </form>
              </div>
              <div className="mt-10">
                  <h2 className="font-semibold text-slate-300 text-2xl text-center">Categorys</h2>
              </div>
              {loading ? <Loader/> :  
                  <div className="overflow-x-auto flex justify-center mt-4">
                  <table className="w-1/2 text-sm text-left rtl:text-right rounded-md text-gray-500 dark:text-gray-400">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                          <tr>
                              <th scope="col" className="px-6 py-3">
                                  Category name
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  Questions
                              </th>
                              <th scope="col" className="px-6 py-3">
                                  Action
                              </th>
                          </tr>
                      </thead>
                    <tbody>
                        {
                            category?.map((item, index) => (
                              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {item.categoryName}
                                  </th>
                                  <td className="px-6 py-4">
                                      {item.totalQuestions}
                                  </td>
                                  <td className="px-6 py-4">
                                      <button className="bg-red-500 px-3 rounded-md text-white py-2" onClick={()=>handleDelete(item._id)}><i className="fa-solid fa-trash"></i></button>
                                  </td>
                              </tr>
                            ))
                        }
                      </tbody>
                  </table>
              </div>
                }
          </div>
      </>
  )
}

export default CategoryTab