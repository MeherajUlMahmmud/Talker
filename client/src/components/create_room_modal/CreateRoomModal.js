import React, { useState } from 'react'
import './createRoomModal.scss'
import { sendPostRequest } from '../../apis/api';
import { CREATE_ROOM_URL } from '../../utils/urls';

function CreateRoomModal({ token, setShowCreateRoomModal, }) {
	const [inputs, setInputs] = useState({
		name: '',
		description: ''
	});

	const handleOnChange = (e) => {
		/*
		 * Update the inputs state
		*/
		setInputs({
			...inputs,
			[e.target.name]: e.target.value
		})
	}

	const handleOnSubmit = (e) => {
		/*
		 * Prevent default form submission
		 * Send create room request
		 * If successful, close modal
		 * If unsuccessful, display the error message
		*/
		e.preventDefault();

		sendPostRequest(CREATE_ROOM_URL, inputs, token)
			.then((res) => {
				console.log(res);
				setShowCreateRoomModal(false);
			})
			.catch((err) => {
				console.log(err);
			})
	}

	return (
		<div className='modal_wrapper'>
			<div className='create_room_modal'>
				<div className='modal_close_btn'
					onClick={() => setShowCreateRoomModal(false)}
				>
					<i className="fas fa-times"></i>
				</div>
				<div className='modal_header'>
					Create Room
				</div>

				<form className='modal_body' onSubmit={(e) => handleOnSubmit(e)}>
					<div className='form_group'>
						<input
							autoFocus
							className='form_input'
							type="text"
							placeholder='Room Name'
							name='name'
							value={inputs.name}
							onChange={(e) => handleOnChange(e)}
							required
						/>
					</div>
					<div className='form_group'>
						<input
							className='form_input'
							type="text"
							placeholder='Room Description'
							name='description'
							value={inputs.description}
							onChange={(e) => handleOnChange(e)}
						/>
					</div>

					<button
						className='form_button'
						type='submit'
					>
						Create
					</button>
				</form>
			</div>
		</div>
	)
}

export default CreateRoomModal