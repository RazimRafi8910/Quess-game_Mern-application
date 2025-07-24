import useFetch from "../../Hooks/useFetch";
import Loader from "../Loader";

type UserType = {
	username: string;
  email: string;
  playerId: number;
  role:string
};

function UserTab() {
	const { data: users, loading, error } = useFetch<UserType[]>("/admin/user");

	if (loading) {
		return (
			<>
				{" "}
				<Loader />{" "}
			</>
		);
	}

	return (
		<>
			<div className="container">
				<div className="text-center py-3">
					<h2 className="text-3xl font-bold underline text-slate-200">
						Users
					</h2>
					<p className="text-red-500">{error}</p>
				</div>
				<div className="overflow-x-auto flex justify-center mt-4">
					<table className="w-1/2 text-sm text-left rtl:text-right rounded-md text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									username
                </th>
                <th scope="col" className="px-6 py-3">
									player Id
								</th>
								<th scope="col" className="px-6 py-3">
									Email
                </th>
                <th scope="col" className="px-6 py-3">
									Role
								</th>
								<th scope="col" className="px-6 py-3">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{users?.map((user, index) => (
								<tr
									key={index}
									className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
									<th
										scope="row"
										className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
										{user.username}
									</th>
                  <td className="px-6 py-4">{ user.playerId || "Not found" }</td>
                  <td className="px-6 py-4">{ user.email }</td>
                  <td className="px-6 py-4">{ user.role }</td>
									<td className="px-6 py-4">
										<button
											className="bg-red-500 px-3 rounded-md text-white py-2"
											onClick={() => {}}>
											<i className="fa-solid fa-trash"></i>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	);
}

export default UserTab;
