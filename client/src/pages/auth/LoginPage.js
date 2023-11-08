import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendAuthRequest } from '../../apis/api';
import { loadStorage, saveStorage } from '../../utils/persistLocalStorage';
import { LOGIN_URL } from '../../utils/urls';
import Navbar from '../../components/Navbar';

function LoginPage() {
	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (e) => {
		/*
		 * Update input state with the current value
		*/
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		/*
		 * Handle user login
		 * Send a POST request to the server with the login credentials
		 * If successful, save the token in local storage and redirect to home page
		 * If unsuccessful, display the error message
		*/
		e.preventDefault();

		setError("");
		setIsLoading(true);

		sendAuthRequest(LOGIN_URL, inputs)
			.then((res) => {
				console.log(res);
				saveStorage("token", res.data.token);
				setIsLoading(false);
				navigate("/");
			})
			.catch((err) => {
				console.log(err);
				setError(err?.response?.data?.error || "Something went wrong");
				setIsLoading(false);
			});
	};

	return (
		<div className='container mx-auto rounded-lg'>
			<Navbar />
			<div className="flex flex-col  px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSubmit} method="POST">
						<div>
							<label for="username" className="block text-sm font-medium leading-6 text-gray-900">
								Username
							</label>
							<div className="mt-2">
								<input
									id="username"
									name="username"
									type="text"
									autocomplete="username"
									onChange={(e) => handleChange(e)}
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
							</div>
						</div>
						<div>
							<div className="flex items-center justify-between">
								<label for="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									autocomplete="current-password"
									onChange={(e) => handleChange(e)}
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
							</div>
						</div>

						{
							error && (
								<div className="text-red-500 text-sm font-medium">
									{error}
								</div>
							)
						}

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
							>
								Sign in
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
						Don't have an account?
						<a href="/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign Up</a>
					</p>
				</div>
			</div>
		</div>
	)
}

export default LoginPage