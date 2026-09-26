const express = require('express');
const path = require('path');
const database = require('./database');
const clientDist = path.join(__dirname, "..", "client", "dist");

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware:
app.use(express.json());
app.use(express.static(clientDist));
app.use('/media', express.static(path.join(__dirname, 'media')));

//JSON data for recordings on the Music page:
const songs = [
    	{
		id: 1,
		title: 'Fare Thee Well',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/faretheewell.mp3'
    	},
    	{
		id: 2,
		title: 'Do Re Mi',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/doremi.wav'
    	},
	{
		id: 3,
		title: 'Mama, I\'m On Your Doorstep',
		year: 2011,
		description: ' ',
		audioUrl: '/media/audio/mamaimonyourdoorstep.wav'
    	},
	{
		id: 4,
		title: 'Baltimore to Washington',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/baltimoretowashington.wav'
	},
	{
		id: 5,
		title: 'Darling, It Ain\'t No Use',
		year: 2010,
		description: ' ',
		audioUrl: '/media/audio/darling,itaintnouse.wav'
    	},
	{
		id: 6,
		title: 'Jumpin\' Jack Flash',
		year: 2011,
		description: 'Cover',
		audioUrl: '/media/audio/jumpinjackflash.wav'
    	},
	{
		id: 7,
		title: 'Supermarkets and Limousines',
		year: 2011,
		description: ' ',
		audioUrl: '/media/audio/supermarketsandlimousines.wav'
    	},
	{
		id: 8,
		title: 'You\'re Gonna Make Me Lonesome When You Go',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/youregonnamakemelonesomewhenyougo.wav'
    	},
	{
		id: 9,
		title: 'Hard Travellin\'',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/hardtravellin.wav'
    	},
	{
		id: 10,
		title: '(Marie\'s the Name) His Latest Flame',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/hislatestflame.wav'
    	},
	{
		id: 11,
		title: 'Lily of the West',
		year: 2011,
		description: 'Cover',
		audioUrl: '/media/audio/lilyofthewest.wav'
    	},
	{
		id: 12,
		title: 'Bide My Time',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/bidemytime.wav'
    	},
	{
		id: 13,
		title: 'Mama You\'ve Been On My Mind',
		year: 2010,
		description: 'Cover',
		audioUrl: '/media/audio/mamayouvebeenonmymind.wav'
    	},
	{
		id: 14,
		title: 'The Travel Song',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/thetravelsong.wav'
    	},
	{
		id: 15,
		title: 'Oregon Trail',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/oregontrail.wav'
    	},
	{
		id: 16,
		title: 'When I\'m Missing You',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/whenimmissingyou.wav'
    	},
	{
		id: 17,
		title: 'My Darling\'s on the Doorstep',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/mydarlingsonthedoorstep.mp3'
    	},	
	{
		id: 18,
		title: 'Hallelujah',
		year: 2011,
		description: ' ',
		audioUrl: '/media/audio/hallelujah.wav'
    	},
	{
		id: 19,
		title: 'Song for a Songbird',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/songforasongbird.wav'
    	},
	{
		id: 20,
		title: 'Rambler, Gambler',
		year: 2010,
		description: 'Cover',
		audioUrl: '/media/audio/ramblergambler.wav'
    	},
	{
		id: 21,
		title: 'In Cold Blood',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/incoldblood.wav'
    	},
	{
		id: 22,
		title: 'Froggie Went a Courtin\'',
		year: 2012,
		description: ' ',
		audioUrl: '/media/audio/froggywentacourtin.wav'
    	},
	{
		id: 23,
		title: 'Gospel Plow',
		year: 2011,
		description: 'Cover',
		audioUrl: '/media/audio/gospelplow.wav'
    	},
	{
		id: 24,
		title: 'Long Time Girl',
		year: 2010,
		description: ' ',
		audioUrl: '/media/audio/longtimegirl.wav'
    	},
	{
		id: 25,
		title: 'Poncho and Lefty',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/ponchoandlefty.wav'
    	},
	{
		id: 26,
		title: 'Clear Blue Picture of a Church',
		year: 2011,
		description: ' ',
		audioUrl: '/media/audio/bytheclearbluepictureofachurch.wav'
    	},
	{
		id: 27,
		title: 'The Boxer',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/theboxer.wav'
    	},
	{
		id: 28,
		title: 'Abandoned Love',
		year: 2012,
		description: 'Cover',
		audioUrl: '/media/audio/abandonedlove.wav'
    	}
];

const videos = [
    	{
		id: 1,
		title: 'Video',
		year: 2013,
		description: ' ',
		videoUrl: '/media/videos/video.mp4',
		posterUrl: '/media/images/video.jpg'
    	}
];

const writings = [
    	{
		id: 1,
		title: 'Title',
		year: 2013,
		excerpt: 'Excerpt.',
		body:
		    'Body.'
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

    	console.log(`The server is running on port ${PORT}.`);
});
