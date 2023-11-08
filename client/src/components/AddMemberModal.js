import React, { useEffect, useState } from 'react'
import { sendGetRequest, sendPostRequest } from '../apis/api';

function AddMemberModal({ token, room, members, setShowAddMemberModal }) {
	const [allUsers, setAllUsers] = useState([])
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchAllUsers()
	}, [])

	const fetchAllUsers = () => {
		sendGetRequest('/user/list', token)
			.then((res) => {
				console.log(res?.data);
				setAllUsers(res?.data?.users)

				filterUsers(res?.data?.users)
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const filterUsers = (users) => {
		let filteredUsers = users.filter((user) => {
			let isMember = false;
			members.forEach((member) => {
				if (member?._id === user?._id) {
					isMember = true;
				}
			})
			return !isMember;
		})

		setAllUsers(filteredUsers)
	};

	const handleAddMember = (member) => {
		sendPostRequest('/room/add-member', { roomId: room?._id, userId: member?._id }, token)
			.then((res) => {
				console.log(res?.data);
				setShowAddMemberModal(false);
			})
			.catch((err) => {
				console.log(err);
				setShowAddMemberModal(false);
			});
	};

	return (
		<div className='fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center'>
			<div className='bg-white p-5 rounded-md w-full md:w-1/2 lg:w-1/3'>
				<div className='flex flex-row justify-between items-center'>
					<h3 className='font-semibold'>Add Member</h3>
					<button
						type='button'
						onClick={() => setShowAddMemberModal(false)}
						className='bg-red-500 text-white p-2 rounded-md'>
						<svg class="w-[16px] h-[16px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
						</svg>
					</button>
				</div>
				<div className='flex flex-col'>
					{
						!isLoading && allUsers.map((user) => {
							return (
								<div
									key={user?._id}
									className='flex flex-row justify-between items-center py-2'
								>
									<div className='flex flex-row items-center'>
										<img
											src="https://via.placeholder.com/150"
											className="object-cover h-12 w-12 rounded-full"
											alt=""
										/>
										<div className='ml-2'>
											<div className='font-semibold'>{user?.username}</div>
										</div>
									</div>
									<button
										type='button'
										onClick={() => handleAddMember(user)}
										className='bg-blue-500 text-white px-3 py-1 rounded-md'>Add</button>
								</div>
							)
						})
					}
				</div>
			</div>
		</div>
	)
}

export default AddMemberModal