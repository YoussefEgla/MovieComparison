const autoComplete = document.querySelector('.autocomplete');
autoComplete.innerHTML = `
    <label><b>Search For a Movie</b></label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;
const SearchInput = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.results');

const fetchData = async (searchTerm) => {
	const response = await axios.get(`http://www.omdbapi.com/`, {
		params: {
			apikey: 'f3761138',
			s: searchTerm
		}
	});
	if (response.data.Error) {
		return undefined;
	} else {
		return response.data.Search;
	}
};

const onInput = async (event) => {
	const movies = await fetchData(event.target.value);

	resultsWrapper.innerHTML = '';

	// If there is no result
	if (movies !== undefined) {
		dropdown.classList.add('is-active');
		for (let movie of movies) {
			const option = document.createElement('a');
			option.classList.add('dropdown-item');
			const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
			option.innerHTML = `
                <img src="${imgSrc}" />
                ${movie.Title}
            `;

			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				SearchInput.value = movie.Title;
				onMovieSelect(movie);
			});
			resultsWrapper.appendChild(option);
		}
	}
};

SearchInput.addEventListener('input', debounce(onInput, 1500));

document.addEventListener('click', (event) => {
	if (!autoComplete.contains(event.target)) {
		dropdown.classList.remove('is-active');
	}
});

onMovieSelect = async (movie) => {
	const response = await axios.get(`http://www.omdbapi.com/`, {
		params: {
			apikey: 'f3761138',
			i: movie.imdbID
		}
	});
	document.querySelector('#summary').innerHTML = movieTemplate(response.data);
};

const movieTemplate = (movieDetail) => {
	return `
        <div class="columns is-vcentered">
            <div class="column is-one-quarter">
                <img src="${movieDetail.Poster}" />
            </div>
            <div class="column">
                <h1 class="title is-1">${movieDetail.Title}</h1>
                <h4 class="subtitle is-4">${movieDetail.Genre}</h4>
                <p class="subtitle">${movieDetail.Plot}</p>
            </div>
        </div>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
