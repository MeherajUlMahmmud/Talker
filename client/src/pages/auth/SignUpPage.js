import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendAuthRequest } from "../../apis/api";
import { SIGNUP_URL } from "../../utils/urls";
import './auth.scss';

const SignUpPage = () => {
	const navigate = useNavigate();

	const [inputs, setInputs] = useState({
		username: "",
		name: "",
		password: "",
	});

	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

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
		 * If successful, redirect to login page
		 * If unsuccessful, display the error message
		*/
		e.preventDefault();
		console.log(inputs);

		setError("");
		setIsLoading(true);

		sendAuthRequest(SIGNUP_URL, inputs)
			.then((res) => {
				console.log(res);
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
		<div className='auth_wrapper'>
			<div className="form_wrapper">
				<div className="form_header">
					<p className='header1'>Create an account</p>
				</div>

				<form className="auth_form" onSubmit={handleSubmit} method="POST">
					<div className="form_group">
						<label for="username" className="form_label">
							USERNAME
						</label>
						<input
							id="username"
							name="username"
							type="text"
							autocomplete="username"
							onChange={(e) => handleChange(e)}
							required
							className="form_input" />
					</div>
					<div className="form_group">
						<label for="name" className="form_label">
							Name
						</label>
						<input
							id="name"
							name="name"
							type="text"
							autocomplete="name"
							onChange={(e) => handleChange(e)}
							required
							className="form_input" />
					</div>
					<div className="form_group">
						<label for="password" className="form_label">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							onChange={(e) => handleChange(e)}
							required
							className="form_input" />
					</div>

					{
						error && (
							<div className="auth_error">
								{error}
							</div>
						)
					}

					<button
						type="submit"
						disabled={isLoading}
						className="form_button"
					>
						Sign Up
					</button>

					<p className="auth_account_label">
						Already have an account?
						<a href="/auth/login" className="auth_link"> Sign In</a>
					</p>
				</form>

			</div>
		</div>
	);
};

export default SignUpPage;