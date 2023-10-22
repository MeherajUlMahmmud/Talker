import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { loadStorage, saveStorage } from '../utils/persistLocalStorage'
import { useNavigate } from 'react-router-dom';
import { sendGetRequest } from '../apis/api';
import { ASSOCIATED_ROOMS, PROFILE_URL } from '../utils/urls';
import { formatDateTime } from '../utils/helper';

function HomePage() {
	const token = loadStorage('token');
	const [user, setUser] = useState(loadStorage('user'));
	const navigate = useNavigate();

	const [rooms, setRooms] = useState([])
	const [activeRoom, setActiveRoom] = useState({})

	const [showAddMemberModal, setShowAddMemberModal] = useState(false)

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		if (token) {
			if (!user) {
				fetchUser();
			}
			fetchAssociatedRooms()
		} else {
			navigate('/login')
		}
	}, [token])

	const fetchUser = (e) => {
		sendGetRequest(PROFILE_URL, token)
			.then((res) => {
				console.log(res?.data);
				setUser(res?.data?.user)
				saveStorage('user', res?.data?.user)
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data?.message || "Something went wrong");
				setIsLoading(false);
			});
	}

	const fetchAssociatedRooms = () => {
		sendGetRequest(ASSOCIATED_ROOMS + '/' + user?._id, token)
			.then((res) => {
				console.log(res?.data);

				setRooms(res?.data?.rooms)
				setActiveRoom(res?.data?.rooms[0] || {})
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data?.message || "Something went wrong");
				setIsLoading(false);
			});
	}

	return (
		<>
			<div className="container mx-auto shadow-lg rounded-lg">
				<Navbar user={user} />
				<div className="flex flex-row justify-between bg-white">
					<div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
						{
							rooms.map((room) => {
								return (
									<div
										className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 border-gray-200 cursor-pointer ${activeRoom?._id === room?._id ? 'bg-gray-200' : ''}`}
										key={room?._id}
										onClick={() => setActiveRoom(room)}
									>
										<div className="w-1/4">
											<img
												src="https://via.placeholder.com/150"
												className="object-cover h-12 w-12 rounded-full"
												alt=""
											/>
										</div>
										<div className="w-full">
											<div className="text-lg font-semibold">
												{room?.name}
											</div>
										</div>
									</div>
								)
							})
						}
					</div>
					<div className="w-full px-5 flex flex-col justify-between">
						<div className="flex flex-col mt-5">
							<div className="flex justify-end mb-4">
								<div
									className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
								>
									Welcome to group everyone !
								</div>
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
							</div>
							<div className="flex justify-end mb-4">
								<div
									className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
								>
									Welcome to group everyone !
								</div>
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
							</div>
							<div className="flex justify-end mb-4">
								<div
									className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
								>
									Welcome to group everyone !
								</div>
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
							</div>
							<div className="flex justify-end mb-4">
								<div
									className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
								>
									Welcome to group everyone !
								</div>
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
							</div>
							<div className="flex justify-start mb-4">
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
								<div
									className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
								>
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
									at praesentium, aut ullam delectus odio error sit rem. Architecto
									nulla doloribus laborum illo rem enim dolor odio saepe,
									consequatur quas?
								</div>
							</div>
							<div className="flex justify-end mb-4">
								<div>
									<div
										className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
									>
										Lorem ipsum dolor, sit amet consectetur adipisicing elit.
										Magnam, repudiandae.
									</div>

									<div
										className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
									>
										Lorem ipsum dolor sit amet consectetur adipisicing elit.
										Debitis, reiciendis!
									</div>
								</div>
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
							</div>
							<div className="flex justify-start mb-4">
								<img
									src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
									className="object-cover h-8 w-8 rounded-full"
									alt=""
								/>
								<div
									className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
								>
									happy holiday guys!
								</div>
							</div>
						</div>
						<div className="py-5">
							<input
								className="w-full bg-gray-300 py-5 px-3 rounded-xl"
								type="text"
								placeholder="type your message here..."
							/>
						</div>
					</div>
					<div className="w-2/5 border-l-2 px-5">
						<div className="flex flex-col">
							<div className="font-semibold text-xl py-1">
								{activeRoom && activeRoom?.name}
							</div>
							<small className='py-2'>
								Created: {activeRoom && formatDateTime(activeRoom?.createdAt)}
							</small>
							<hr />
							<div>
								<div className='flex flex-row justify-between items-center py-2'>
									<h3 className='font-semibold py-2'>Members</h3>
									<button
										type='button'
										onClick={() => setShowAddMemberModal(true)}
										className='bg-blue-500 text-white px-3 py-1 rounded-md'>Add</button>
								</div>
								<div>
									{
										activeRoom?.members?.map((member) => {
											return (
												<div className="flex flex-row py-4 px-2 justify-center items-center border-b-2 border-gray-200 cursor-pointer">
													<div className="w-1/4 mx-2">
														<img
															src="https://via.placeholder.com/150"
															className="object-cover h-12 w-12 rounded-full"
															alt=""
														/>
													</div>
													<div className="w-full">
														<div className="text-lg font-semibold">
															{member?.username} {activeRoom?.owner?.username === member?.username ? '(owner)' : ''}
														</div>
													</div>
												</div>
											)
										})
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{
				showAddMemberModal && <AddMemberModal
					token={token}
					members={activeRoom?.members}
					setShowAddMemberModal={setShowAddMemberModal}
				/>
			}
		</>
	)
}

const AddMemberModal = ({ token, members, setShowAddMemberModal }) => {
	const [allUsers, setAllUsers] = useState([])

	useEffect(() => {
		fetchAllUsers()
	}, [])

	const fetchAllUsers = () => {
		sendGetRequest('/users', token)
			.then((res) => {
				console.log(res?.data);
				setAllUsers(res?.data?.users)

				filterUsers(res?.data?.users)
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
		console.log(member);
	};

	return (
		<div className='fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center'>
			<div className='bg-white p-5 rounded-md w-full md:w-1/2 lg:w-1/3'>
				<div className='flex flex-row justify-between items-center'>
					<h3 className='font-semibold'>Add Member</h3>
					<button
						type='button'
						onClick={() => setShowAddMemberModal(false)}
						className='bg-red-500 text-white px-3 py-1 rounded-md'>Close</button>
				</div>
				<div className='flex flex-col'>
					{
						allUsers.map((user) => {
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
									{

									}
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

export default HomePage