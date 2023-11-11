import { delStorage } from "./persistLocalStorage";

export const isAuthorized = (error) => {
	if (error?.response?.status === 401) {
		return false;
	}
	return true;
};

export const logout = () => {
	delStorage("user");
	delStorage("token");
};

export const calculateTimeAgo = (date) => {
	const timeAgo = new Date(date).getTime();
	const now = new Date().getTime();
	const diff = now - timeAgo;
	const diffInDays = diff / (1000 * 60 * 60 * 24);
	const diffInHours = diff / (1000 * 60 * 60);
	const diffInMinutes = diff / (1000 * 60);
	const diffInSeconds = diff / 1000;
	if (diffInDays >= 1) {
		return `${Math.floor(diffInDays)} days ago`;
	} else if (diffInHours >= 1) {
		return `${Math.floor(diffInHours)} hours ago`;
	} else if (diffInMinutes >= 1) {
		return `${Math.floor(diffInMinutes)} minutes ago`;
	} else if (diffInSeconds >= 1) {
		return `${Math.floor(diffInSeconds)} seconds ago`;
	} else {
		return "Just now";
	}
};

export const formatDateTime = (dateTime) => {
	// July 16, 2023 at 12:00 PM
	const date = new Date(dateTime);
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};
	return date.toLocaleString("en-US", options);
};