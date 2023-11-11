import React, { useContext, useEffect, useRef, useState } from 'react'
import './serverPage.scss'
import { formatDateTime } from '../../utils/helper'
import RoomContext from '../../contexts/RoomContext';
import { sendGetRequest } from '../../apis/api';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';

function ServerPage() {
	const { activeRoom, showMembersList } = useContext(RoomContext);
	const { socketRef } = useContext(SocketContext);
	const { user, token } = useContext(UserContext);

	const messagesEndRef = useRef(null)

	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([])
	const [roomMembers, setRoomMembers] = useState([])

	useEffect(() => {
		fetchRoomMessages()
		fetchRoomMembers()
	}, [activeRoom]);
	useEffect(() => {
		scrollToBottom()
	}, [messages]);

	useEffect(() => {
		if (socketRef.current) {
			socketRef.current.on('messageResponse', (data) => {
				console.log('messageResponse');
				console.log(data);
				setMessages((messages) => [...messages, data]);
			});

		}
	}, [activeRoom]);

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
			});
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
				setRoomMembers(res?.data?.members)
			})
			.catch((err) => {
				console.log(err);
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
		<div className='server_page_wrapper'>
			<div className='message_section' style={{
				width: showMembersList ? '75%' : '100%'
			}}>
				<div className="message_body_wrapper">
					{
						messages.map((message) => {
							return (
								// message?.sender?._id === user?._id ? (
								// 	<div className="message_item right">
								// 		<div className='message_item_img_sec'>
								// 			<img src={`https://via.placeholder.com/468x300?text=${message?.sender?.username[0].toUpperCase()}`} className="message_item_img" alt="" />
								// 		</div>
								// 		<div className='message_item_data_sec'>
								// 			<div className='message_name_date'>
								// 				<div className='message_name'>
								// 					{message?.sender?.username}
								// 				</div>
								// 				<div className='message_date'>
								// 					{formatDateTime(message?.timestamp)}
								// 				</div>
								// 			</div>
								// 			<div className='message_text'>
								// 				{message?.text}
								// 			</div>
								// 		</div>
								// 	</div>
								// ) : (
								<div className={`message_item ${message?.sender?._id === user?._id && 'own'}`} key={message?._id}>
									<div className='message_item_img_sec'>
										<img src={`https://via.placeholder.com/468x300?text=${message?.sender?.username[0].toUpperCase()}`} className="message_item_img" alt="" />
									</div>
									<div className='message_item_data_sec'>
										<div className='message_name_date'>
											<div className='message_name'>
												{message?.sender?.username}
											</div>
											<div className='message_date'>
												{formatDateTime(message?.timestamp)}
											</div>
										</div>
										<div className='message_text'>
											{message?.text}
										</div>
									</div>
								</div>
								// )
							)
						})
					}
					<div ref={messagesEndRef} style={{
						height: '0px',
						width: '0px',
						overflow: 'hidden'
					}} />
				</div>

				<form className='message_input_wrapper'
					onSubmit={handleSendMessage}
				>
					<input
						autoFocus
						className='input'
						type="text"
						placeholder='Enter your message...'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
				</form>
			</div>
			{
				showMembersList && (
					<div className='members_section'>
						<div className='members_section_body'>
							<div className='members_section_header'>
								Members ({roomMembers.length})
							</div>
							<div className='members_list'>
								{
									roomMembers.map((member) => {
										return (
											<div className='member_item' key={member?._id}>
												<div className='member_item_img_sec'>
													<img src={`https://via.placeholder.com/468x300?text=${member?.username[0].toUpperCase()}`} className="member_item_img" alt="" />
												</div>
												<div className='member_item_data_sec'>
													<div className='member_name'>
														<div>
															{member?.username}
														</div>
														<div style={{
															color: '#E7AA30',
														}}>
															{member?._id === activeRoom?.owner?._id && (
																<svg aria-label="Server Owner" class="ownerIcon__827bd icon__131d1" aria-hidden="false" role="img" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.6572 5.42868C13.8879 5.29002 14.1806 5.30402 14.3973 5.46468C14.6133 5.62602 14.7119 5.90068 14.6473 6.16202L13.3139 11.4954C13.2393 11.7927 12.9726 12.0007 12.6666 12.0007H3.33325C3.02725 12.0007 2.76058 11.792 2.68592 11.4954L1.35258 6.16202C1.28792 5.90068 1.38658 5.62602 1.60258 5.46468C1.81992 5.30468 2.11192 5.29068 2.34325 5.42868L5.13192 7.10202L7.44592 3.63068C7.46173 3.60697 7.48377 3.5913 7.50588 3.57559C7.5192 3.56612 7.53255 3.55663 7.54458 3.54535L6.90258 2.90268C6.77325 2.77335 6.77325 2.56068 6.90258 2.43135L7.76458 1.56935C7.89392 1.44002 8.10658 1.44002 8.23592 1.56935L9.09792 2.43135C9.22725 2.56068 9.22725 2.77335 9.09792 2.90268L8.45592 3.54535C8.46794 3.55686 8.48154 3.56651 8.49516 3.57618C8.51703 3.5917 8.53897 3.60727 8.55458 3.63068L10.8686 7.10202L13.6572 5.42868ZM2.66667 12.6673H13.3333V14.0007H2.66667V12.6673Z" fill="currentColor" aria-hidden="true"></path></svg>
															)}
														</div>

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
		</div >
	)
}

export default ServerPage