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

	//useeffect to fetch rate limit and consider destructuring
	useEffect(() => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				const {
					rate: { remaining },
				} = data;
				setRequests(remaining);
				if (remaining === 0) {
					// throw an error
				}
			})
			.catch((err) => console.log(err));
	}, []);

	const handleSearch = (e) => {
		setSearch(e.target.value);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
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
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubContext, GithubProvider };
