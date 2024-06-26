// Import Axios and Cheerio
const axios = require('axios');
const cheerio = require('cheerio');

const getPostTitles = async () => {
	try {
		// Load Reddit
		const { data } = await axios.get(
			'https://old.reddit.com/r/programming/'
		);

		// Parse HTML with Cheerio
		const $ = cheerio.load(data);

		// Initialise empty data array
		const postTitles = [];

		// Iterate over all anchor links for the given selector and ....
		$('div > p.title > a').each((_idx, el) => {
			// .... extract for each the tag text and add it to the data array
			const postTitle = $(el).text()
			postTitles.push(postTitle)
		});

		// Return the array with all titles
		return postTitles;
	} catch (error) {
		throw error;
	}
};

// Wait for the promise to fulfill and print the title array it returned
getPostTitles()
    .then((postTitles) => console.log(postTitles));