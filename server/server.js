const express = require('express') 
const path = require('path');
const database = require('./database');
const clientDist = path.join(__dirname, "client", "dist");

const app = express()
const PORT = process.env.PORT || 8080 

//Middleware
app.use(express.json());
app.use(express.static(clientDist));
app.use('/media', express.static(path.join(__dirname, 'media')))

const songs = [
    	{
		id: 1,
		title: 'Song 1',
		year: 2011,
		description: 'Song.',
		audioUrl: '/media/audio/first-song.mp3'
    	},
    	{
		id: 2,
		title: 'Song 2',
		year: 2012,
		description: 'Song.',
		audioUrl: '/media/audio/second-song.mp3'
    	}
];

const videos = [
    	{
		id: 1,
		title: 'Video',
		year: 2013,
		description: 'Video.',
		videoUrl: '/media/video/video.mp4',
		posterUrl: '/media/images/video.jpg'
    	}
];

const writings = [
    	{
		id: 1,
		title: 'Notes on Painting and Sound',
		year: 2025,
		excerpt: 'An essay about relationships between visual and musical form.',
		body:
		    'The paintings and recordings developed together. Repetition, rhythm, silence, and colour became related methods of organizing experience.'
    	}
];

//API routes:
app.get('/api/artworks', (request, response) => {
	try {
		const category = request.query.category;
		let artworks;
		if (category) {
			artworks = database
				.prepare(`
					SELECT 
						id, 
						title, 
						slug,
						year, 
						category,
						medium, 
						dimensions, 
						description,
						alt_text AS altText,
						thumbnail_url AS thumbnailUrl, 
						image_url AS imageUrl,
						display_order AS displayOrder,
						is_featured AS isFeatured
					FROM artworks 
					WHERE category = ?
					ORDER BY display_order ASC, id ASC
				`).all(category);
		} else {
			artworks = database
				.prepare(`
					SELECT 
						id, 
						title, 
						slug,
						year, 
						category,
						medium, 
						dimensions, 
						description,
						alt_text AS altText,
						thumbnail_url AS thumbnailUrl, 
						image_url AS imageUrl,
						display_order AS displayOrder,
						is_featured AS isFeatured
					FROM artworks 
					ORDER BY display_order ASC, id ASC
				`).all();
		}
		response.json(artworks);
	} catch (error) {
		console.error('There was a problem retrieving the artworks:', error);
		response.status(500).json({
			message: 'Zero artworks were retrieved.'});
	}
});

app.get('/api/artworks/:id', (request, response) => {
	const artworkId = Number(request.params.id);

	if(!Number.isInteger(artworkId)) {
		return response.status(400).json({
			message: 'The artwork ID must be an integer.'
		});
	}

	try {
		const artwork = database.prepare(`SELECT id, title, slug, year, category, medium, dimensions, description, alt_text AS altText, thumbnail_url AS thumbnailUrl, image_url AS imageUrl, display_order AS displayOrder, is_featured AS isFeatured FROM artworks WHERE id = ?`).get(artworkId);

		if (!artwork) {
			return response.status(404).json({
				message: 'No artwork was found.'
			});
		}

    		response.json(artwork);
	} catch (error) {
		console.error('There was a problem retrieving the artwork:', error);
		response.status(500).json({
			message: 'No artwork was retrieved.'
		});
	}
});

app.get('/api/songs', (request, response) => {
	response.json(songs);
});

app.get('/api/videos', (request, response) => {
	response.json(videos);
});

app.get('/api/writings', (request, response) => {
	response.json(writings);
});

app.use((request, response, next) => {
    if (
        request.method === "GET" &&
        !request.path.startsWith("/api/") &&
        !request.path.startsWith("/media/")
    ) {
        response.sendFile(
            path.join(clientDist, "index.html")
        );
    } else {
        next();
    }
});

//To handle errors in finding the above API endpoints:
app.use('/api', (request, response) => {
	response.status(404).json({
		message: 'The API endpoint failed to be found.'
	});
});

//To run the server:
app.listen(PORT, error => {
  	if (error) {
	  	console.error('The server failed to run:', error);
	  	return;
	}

    	console.log(`Server running on port ${PORT}`);
});
