const searchFilms = async (req, res) => {
    const query = req.query.title;
    const length = req.query.yearsAgo;

    if (!query) {
        return res.status(400).json({ error: "Please provide a title" });
    }

    try {
        const url = `https://movies-tv-shows-database.p.rapidapi.com/?title=${query}`
        const options = {
            method: "GET",
            headers: {
                Type: "get-movies-by-title",
                "X-RapidAPI-Key": `${process.env.RAPIDAPI_KEY}`,
                "X-RapidAPI-Host": "movies-tv-shows-database.p.rapidapi.com",
            },
        };
        const response = await fetch(url, options)
        const result = await response.json()
        const movies = result.movie_results;

        const filteredMovies = movies
            .filter(movie => movie.year !== 0)
            .map(({ title, year }) => ({ title, year }))

        filteredMovies.sort((a, b) => b.year - a.year)

        if (length) {

            const currentYear = new Date().getFullYear()

            const cutoffYear = currentYear - length

            const recentMovies = filteredMovies.filter(movie => movie.year >= cutoffYear)
            res.status(200).json({ movies: recentMovies })
        }
        else {
            res.status(200).json({ movies: filteredMovies })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message })
    }
};

module.exports = { searchFilms };
