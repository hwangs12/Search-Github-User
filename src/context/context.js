import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
	const [search, setSearch] = useState("");
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);

	//set requests and loading state
	const [requests, setRequests] = useState(60);
	const [loading, setLoading] = useState(false);

	// error
	const [error, setError] = useState({ show: false, message: "" });

	//check requests
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining },
				} = data;

				setRequests(remaining);
				if (remaining === 0) {
					// throw an error
					toggleError(
						true,
						"sorry, no more requests available. Try it in an hour"
					);
				}
			})
			.catch((err) => console.log(err));
	};

	//useeffect to fetch rate limit and consider destructuring
	useEffect(() => {
		checkRequests();
	}, []);

	const searchGithubUser = async (user) => {
		toggleError();
		setLoading(true);
		const userData = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		);
		if (userData) {
			setGithubUser(userData.data);
			const { repos_url, followers_url } = userData.data;
			//https://api.github.com/users/wesbos/followers
			//https://api.github.com/users/wesbos/repos
			axios(`${repos_url}?per_page=100`)
				.then((response) => {
					if (response) {
						setRepos(response.data);
					}
				})
				.catch((err) => console.log(err));
			axios(`${followers_url}?per_page=100`)
				.then((response) => {
					if (response) {
						setFollowers(response.data);
					}
				})
				.catch((err) => console.log(err));
		} else {
			toggleError(true, "user not found");
		}
		setLoading(false);
		checkRequests();
	};

	function toggleError(show = false, msg = "") {
		setError({ show, message: msg });
	}

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	const handleSubmit = (e, user) => {
		e.preventDefault();
		searchGithubUser(user);
	};

	return (
		<GithubContext.Provider
			value={{
				search,
				handleSearch,
				handleSubmit,
				githubUser,
				repos,
				followers,
				requests,
				error,
				searchGithubUser,
				loading,
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubContext, GithubProvider };
