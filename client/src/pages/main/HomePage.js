import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import socketIO from 'socket.io-client';
import { loadStorage, saveStorage } from '../../utils/persistLocalStorage'
import { sendGetRequest } from '../../apis/api';
import { ASSOCIATED_ROOMS, PROFILE_URL } from '../../utils/urls';
import { calculateTimeAgo, formatDateTime } from '../../utils/helper';
import Navbar from '../../components/Navbar';
import CreateRoomModal from '../../components/CreateRoomModal';
import AddMemberModal from '../../components/AddMemberModal';

function HomePage() {
	const token = loadStorage('token');
	const navigate = useNavigate();
	const socket = socketIO.connect('http://localhost:8000');

	const [user, setUser] = useState(loadStorage('user'));
	const [rooms, setRooms] = useState([])
	const [activeRoom, setActiveRoom] = useState({})
	const [activeRoomMembers, setActiveRoomMembers] = useState([])

	const [messages, setMessages] = useState([]);

	const [showCreateRoomModal, setShowCreateRoomModal] = useState(false)
	const [showAddMemberModal, setShowAddMemberModal] = useState(false)
	const [message, setMessage] = useState('');

	const [isLoadingMessages, setIsLoadingMessages] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");

	const div = useRef(null);

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


	useEffect(() => {
		if (activeRoom) {
			setIsLoadingMessages(true);
			socket.emit('joinRoom', { room_id: activeRoom?._id });
			fetchRoomMessages()
			fetchRoomMembers()
			setIsLoadingMessages(false);
		}
	}, [activeRoom])

	useEffect(() => {
		socket.on('messageResponse', (data) => setMessages([...messages, data]));

		socket.on('error', (data) => {
			console.log(data);
		});
	}, [socket]);

	const fetchUser = (e) => {
		sendGetRequest(PROFILE_URL, token)
			.then((res) => {
				console.log(res?.data);
				setUser(res?.data?.user)
				saveStorage('user', res?.data?.user)
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data || "Something went wrong");
				setIsLoading(false);
			});
	}

	const fetchAssociatedRooms = () => {
		sendGetRequest(ASSOCIATED_ROOMS + '/' + user?._id, token)
			.then((res) => {
				console.log(res?.data);
				setRooms(res?.data?.rooms)
				setActiveRoom(res?.data?.rooms[0])
				setIsLoading(false)
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data || "Something went wrong");
				setIsLoading(false);
			});
	}

	const fetchRoomMessages = () => {
		sendGetRequest('/room/messages/' + activeRoom?._id, token)
			.then((res) => {
				console.log(res?.data);
				setMessages(res?.data?.messages)
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data || "Something went wrong");
				setIsLoadingMessages(false);
			});
	}

	const fetchRoomMembers = () => {
		sendGetRequest('/room/members/' + activeRoom?._id, token)
			.then((res) => {
				console.log(res?.data);
				setActiveRoomMembers(res?.data?.members)
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data || "Something went wrong");
				setIsLoadingMessages(false);
			});
	}

	const handleSendMessage = (e) => {
		e.preventDefault();
		socket.emit('message', {
			message: message,
			user_id: user?._id,
			room_id: activeRoom?._id,
		});
		setMessage('');
	};

	return (
		<>
			<div className="container mx-auto shadow-lg rounded-lg">
				<Navbar user={user} />
				<div className="flex flex-row justify-between bg-white">
					<div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
						<div className='flex flex-col justify-center'>
							{
								isLoading ? (
									<div>
										Loading...
									</div>
								) : (rooms.map((room) => {
									return (
										<div
											className={`flex flex-row py-4 px-2 justify-center items-center border-b-2 border-gray-200 cursor-pointer ${activeRoom?._id === room?._id ? 'bg-gray-200' : ''}`}
											key={room?._id}
											onClick={() => {
												setActiveRoom(room);
											}}
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
								}))
							}
							<div>
								<button
									type='button'
									onClick={() => setShowCreateRoomModal(true)}
									className='bg-blue-500 text-white px-3 py-1 rounded-md mt-5'
								>
									Create Room
								</button>
							</div>
						</div>
					</div>
					<div className="w-full px-5 flex flex-col justify-between">
						{
							activeRoom && (
								<div className='flex flex-col h-full' style={{
									height: 'calc(100vh - 4rem)',
									overflowY: 'auto',
									position: 'relative',
								}}>
									<div className="flex flex-col mt-5"
										style={{
											height: 'calc(100vh - 4rem - 6rem)',
											overflowY: 'auto',
										}}
									>
										{
											isLoadingMessages ? (
												<div className='flex justify-center items-center '>
													Loading messages...
												</div>
											) : (
												messages.map((message) => {
													return (
														message?.sender?._id === user?._id ? (
															<div className="flex justify-end mb-4">
																<div className='flex flex-col'>
																	<div
																		className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
																	>
																		{message?.text}
																	</div>
																	<small>
																		{calculateTimeAgo(message?.timestamp)}
																	</small>
																</div>
																{/* <p
																	className="h-8 w-8 rounded-full"
																	alt=""
																>
																	{message?.sender?.username[0]?.toUpperCase()}
																</p> */}
															</div>
														) : (
															<div className="flex justify-start mb-4">
																{/* <p
																	className="h-8 w-8 rounded-full"
																	alt=""
																>
																	{message?.sender?.username[0]?.toUpperCase()}
																</p> */}
																<div className='flex flex-col'>
																	<div
																		className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
																	>
																		{message?.text}
																	</div>
																	<small>
																		{calculateTimeAgo(message?.timestamp)}
																	</small>
																</div>
															</div>
														)
													)
												})
											)
										}
									</div>
									<div className="py-2 flex w-full bg-white" style={{
										position: 'absolute',
										bottom: 0,
									}}>
										<input
											className="w-full bg-gray-300 py-5 px-3 rounded-xl outline-none"
											type="text"
											placeholder="type your message here..."
											value={message}
											onChange={(e) => setMessage(e.target.value)}
										/>
										<button
											type="button"
											onClick={(e) => handleSendMessage(e)}
											className="bg-blue-400 text-white px-5 py-5 rounded-xl ml-2"
										>
											Send
										</button>
									</div>
								</div>
							)
						}
					</div>
					<div className="w-2/5 border-l-2 px-5">
						{
							activeRoom && (
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
												activeRoomMembers?.map((member) => {
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
							)
						}
					</div>
				</div>
			</div>
			{
				showCreateRoomModal && <CreateRoomModal
					token={token}
					setShowCreateRoomModal={setShowCreateRoomModal}
				/>
			}
			{
				showAddMemberModal && <AddMemberModal
					token={token}
					room={activeRoom}
					members={activeRoomMembers}
					setShowAddMemberModal={setShowAddMemberModal}
				/>
			}
		</>
	)
}

export default HomePage
