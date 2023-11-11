import React, { useContext, useEffect, useRef, useState } from 'react'
import './serverPage.scss'
import { formatDateTime } from '../../utils/helper'
import RoomContext from '../../contexts/RoomContext';
import { sendGetRequest } from '../../apis/api';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';

function ServerPage() {
	const { activeRoom } = useContext(RoomContext);
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
	)
}

export default ServerPage