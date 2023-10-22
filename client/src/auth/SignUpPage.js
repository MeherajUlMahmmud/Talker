import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStorage, saveStorage } from "../utils/persistLocalStorage";
import { sendAuthRequest } from "../apis/api";
import { SIGNUP_URL } from "../utils/urls";
import Navbar from "../components/Navbar";

const SignUpPage = () => {
	const user = loadStorage("user");
	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (user) {
			navigate("/login");
		}
	}, [user, navigate]);

	const handleChange = (e) => {
		setInputs({ ...inputs, [e.target.name]: e.target.value });
	};

	const handleSignUp = (e) => {
		e.preventDefault();
		console.log(inputs);

		setError("");
		setIsLoading(true);

		sendAuthRequest(SIGNUP_URL, inputs)
			.then((res) => {
				console.log(res);
				saveStorage("user", res.data.data);
				setIsLoading(false);
				navigate("/login");
			})
			.catch((err) => {
				console.log(err?.response);
				setError(err?.response?.data?.detail || "Something went wrong");
				setIsLoading(false);
			});

	};

	return (
		<div className='container mx-auto rounded-lg'>
			<Navbar />
			<div className="flex flex-col  px-6 py-12 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create a New Account</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleSignUp} method="POST">
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
									onChange={(e) => handleChange(e)}
									required
									className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
							</div>
						</div>

						<div>
							<button
								type="submit"
								disabled={isLoading}
								className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500"
							>
								Sign Up
							</button>
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
						Already have an account?
						<a href="/sign-up" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign In</a>
					</p>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;