import React, { useState } from 'react'
import { sendPostRequest } from '../apis/api';
import { CREATE_ROOM_URL } from '../utils/urls';

function CreateRoomModal({ token, setShowCreateRoomModal }) {
	const [inputs, setInputs] = useState({
		roomName: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	};

	const handleCreateRoom = (e) => {
		e.preventDefault();
		setIsLoading(true);
		sendPostRequest(CREATE_ROOM_URL, inputs, token)
			.then((response) => {
				setIsLoading(false);
				setShowCreateRoomModal(false);
			})
			.catch((error) => {
				console.log(error);
				setIsLoading(false);
				setError(error?.response?.data?.message);
			});
	}

	return (
		<div className='fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex justify-center items-center'>
			<div className='bg-white p-5 rounded-md w-full md:w-1/2 lg:w-1/3'>
				<div className='flex flex-row justify-between items-center'>
					<h3 className='font-semibold'>Create New Room</h3>
					<button
						type='button'
						onClick={() => setShowCreateRoomModal(false)}
						className='bg-red-500 text-white p-2 rounded-md'>
						<svg class="w-[16px] h-[16px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
						</svg>
					</button>
				</div>
				<div className='flex flex-col'>
					<div className="mt-1 sm:mx-auto sm:w-full sm:max-w-sm">
						<form className="space-y-6" onSubmit={handleCreateRoom} method="POST">
							<div>
								<label for="username" className="block text-sm font-medium leading-6 text-gray-900">
									Room Name
								</label>
								<div className="mt-2">
									<input
										autoFocus
										id="roomName"
										name="roomName"
										type="text"
										autocomplete="roomName"
										onChange={(e) => handleChange(e)}
										required
										className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
								</div>
							</div>

							{
								error && <p className="text-red-500 text-sm">{error}</p>
							}

							<div>
								<button
									type="submit"
									disabled={isLoading}
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
								>
									Create Room
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateRoomModal