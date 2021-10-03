import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
	const { repos } = React.useContext(GithubContext);
	let languages = repos.reduce((total, item) => {
		const { language, stargazers_count } = item;
		if (!language) {
			return total;
		}
		if (!total[language]) {
			total[language] = {
				label: language,
				value: 1,
				stars: stargazers_count,
			};
		} else {
			total[language] = {
				...total[language],
				value: total[language].value + 1,
				stars: total[language].stars + stargazers_count,
			};
		}

		return total;
	}, {});

	const committedMost = Object.values(languages).sort(
		(a, b) => b.value - a.value
	);

	const mostPopular = Object.values(languages)
		.sort((a, b) => b.stars - a.stars)
		.map((language) => {
			const { label, stars } = language;
			return { label, value: stars };
		});

	// stars, forks per repo

	let { stars, forks } = repos.reduce(
		(total, item) => {
			const { stargazers_count, name, forks } = item;
			total.stars[name] = { label: name, value: stargazers_count };
			total.forks[name] = { label: name, value: forks };
			return total;
		},
		{
			stars: {},
			forks: {},
		}
	);

	const starredRepos = Object.values(stars)
		.sort((a, b) => b.value - a.value)
		.slice(0, 5);
	const forkedRepos = Object.values(forks)
		.sort((a, b) => b.value - a.value)
		.slice(0, 5);

	return (
		<section className="section">
			<Wrapper className="section-center">
				<Pie3D data={committedMost} />
				<Column3D data={starredRepos} />
				<Doughnut2D data={mostPopular} />
				<Bar3D data={forkedRepos} />
			</Wrapper>
		</section>
	);
};

const Wrapper = styled.div`
	display: grid;
	justify-items: center;
	gap: 2rem;
	@media (min-width: 800px) {
		grid-template-columns: 1fr 1fr;
	}

	@media (min-width: 1200px) {
		grid-template-columns: 2fr 3fr;
	}

	div {
		width: 100% !important;
	}
	.fusioncharts-container {
		width: 100% !important;
	}
	svg {
		width: 100% !important;
		border-radius: var(--radius) !important;
	}
`;

export default Repos;
