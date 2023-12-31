import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';
import { loadStorage, saveStorage } from '../../utils/persistLocalStorage'
import { sendGetRequest } from '../../apis/api';
import { ASSOCIATED_ROOMS, PROFILE_URL } from '../../utils/urls';
import { calculateTimeAgo, formatDateTime } from '../../utils/helper';
import Navbar from '../../components/Navbar';
import CreateRoomModal from '../../components/CreateRoomModal';
import AddMemberModal from '../../components/AddMemberModal';

function HomePage() {
	const socketRef = useRef();
	const messagesEndRef = useRef(null)

	const token = loadStorage('token');
	const navigate = useNavigate();

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

	useEffect(() => {
		/*
		 * this will scroll to the bottom of the chat window when a new message is received
		*/
		scrollToBottom()
	}, [messages])

	useEffect(() => {
		/*
		 * If token is not present, redirect to login page
		 * If token is present, fetch user details and connect to socket
		 * If socket is connected, fetch associated rooms
		*/
		if (token) {
			if (!user) {
				fetchUser();
			}
			socketRef.current = io('http://localhost:8001');

			fetchAssociatedRooms()
		} else {
			navigate('/login')
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		}
	}, [token])

	useEffect(() => {
		/*
		 * If active room is present, join the room and fetch messages, members, and scroll to bottom
		*/
		if (socketRef.current && activeRoom?._id) {
			setIsLoadingMessages(true);
			socketRef.current.emit('joinRoom', { room_id: activeRoom?._id });
			fetchRoomMessages()
			fetchRoomMembers()
			setIsLoadingMessages(false);
			scrollToBottom()
		}
	}, [activeRoom])

	useEffect(() => {
		/*
		 * If socket is connected, listen for new messages and errors
		*/
		if (socketRef.current) {
			socketRef.current.on('messageResponse', (data) => {
				setMessages((prevMessages) => [...prevMessages, data])
			});

			socketRef.current.on('error', (data) => {
				console.log(data);
			});
		}
	}, [activeRoom]);

	const fetchUser = (e) => {
		/*
		 * Fetch user details
		 * If successful, save user details in local storage
		 * If unsuccessful, display the error message
		*/
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
		/*
		 * Fetch associated rooms
		 * If successful, set rooms and active room
		 * If unsuccessful, display the error message
		 * Set loading to false
		*/
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

	const scrollToBottom = () => {
		/*
		 * Scroll to bottom of the chat window
		*/
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	const fetchRoomMessages = () => {
		/*
		 * Fetch room messages
		 * If successful, set messages
		 * If unsuccessful, display the error message
		*/
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
		/*
		 * Fetch room members
		 * If successful, set members
		 * If unsuccessful, display the error message
		*/
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
		/*
		 * Send message to the server
		 * If successful, set message to empty string
		 * If unsuccessful, display the error message
		*/
		e.preventDefault();
		socketRef.current.emit('message', {
			message: message,
			user_id: user?._id,
			username: user?.username,
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
												<img src={`https://via.placeholder.com/468x300?text=${room?.name[0].toUpperCase()}`} className="object-cover h-12 w-12 rounded-full" alt="" />
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
																<div className='flex'>
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
																	<img src={`https://via.placeholder.com/468x300?text=${message?.sender?.username[0].toUpperCase()}`} className="object-cover h-12 w-12 rounded-full" alt="" />
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
																<div className='flex'>
																	<img src={`https://via.placeholder.com/468x300?text=${message?.sender?.username[0].toUpperCase()}`} className="object-cover h-12 w-12 rounded-full" alt="" />
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
															</div>
														)
													)
												})
											)
										}
									</div>
									<div ref={messagesEndRef} />
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
																<img src={`https://via.placeholder.com/468x300?text=${member?.username[0].toUpperCase()}`} className="object-cover h-12 w-12 rounded-full" alt="" />
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
