import {
    useEffect,
    useRef,
    useState
} from 'react';

import {
    Link,
    Route,
    Routes
} from 'react-router';

/*
 * Reusable function for retrieving data from Express.
 */
function useApi(endpoint) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const controller = new AbortController();

        async function loadData() {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(endpoint, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error(
                        `Request failed with status ${response.status}`
                    );
                }

                const result = await response.json();
                setData(result);
            } catch (requestError) {
                if (requestError.name !== 'AbortError') {
                    setError(requestError.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        loadData();

        return () => {
            controller.abort();
        };
    }, [endpoint]);

    return {
        data,
        loading,
        error
    };
}

function LoadingMessage({ loading, error }) {
    if (loading) {
        return <p>Loading content…</p>;
    }

    if (error) {
        return (
            <p role="alert">
                The content could not be loaded: {error}
            </p>
        );
    }

    return null;
}

// To create text links at the top of the page to the home page and other pages:
function Header() {
    return (
        <header className="site-header">
            <Link className="artist-name" to="/">
                Alex Williamson
            </Link>

            <nav aria-label="Sections">
                <Link to="/paintings">Paintings</Link>
                <Link to="/drawings">Drawings</Link>
                <Link to="/sculptures">Sculptures</Link>
                <Link to="/other-media">Other media</Link>
	        <Link to="/biography">Biography</Link>
	    	<Link to="/cv">CV</Link>
            </nav>
        </header>
    );
}

// To show the artist name, text and image links, and artist statement on the home page:
function Home() {
    return (
        <section className="home-page">
            <h1>Alex Williamson</h1>

            <div className="home-links">
                <Link to="/paintings" className="home-link">
	    	    <span>Paintings</span>
	            <img
	                src="/media/images/home/paintings.jpg"
	                alt="Paintings"
	            />
	        </Link>
                <Link to="/drawings" className="home-link">
	    	    <span>Drawings</span>
	            <img
	                src="/media/images/home/drawings.jpg"
	                alt="Drawings"
	            />
	        </Link>
                <Link to="/sculptures" className="home-link">
	    	    <span>Sculptures</span>
	            <img
	                src="/media/images/home/sculptures.jpg"
	                alt="Sculptures"
	            />
	        </Link>
                <Link to="/other-media" className="home-link">
	    	    <span>Other media</span>
	            <img
	                src="/media/images/home/other_media.jpg"
	                alt="Other media"
	            />
	        </Link>
	    </div>

            <div className="artist-statement">
                <p>
		    Alex’s work focuses on painting and drawing, but also includes sculpture, lithography and other media.  It is both figurative and abstract and incorporates elements of expressionism, minimalism, and collage.  His figurative works are made from a variety of sources: life models, photographs, movie stills, paper collages, and works by other artists such as Vermeer, Rembrandt, and Matisse.  His abstract works are both expressionistic and minimalist, with an emphasis on materials, composition, and colour.
                </p>

                <p>
               	Alex’s sculptures are mostly made from found materials and are highly influenced by the readymade and post-minimalist works of Marcel Duchamp, Jeff Koons, and many others.
                </p>
            </div>
        </section>
    );
}

// To show a larger image and information about an artwork in a white, closeable window when a user clicks on the image of an artwork:
function ArtworkModal({ artwork, onClose }) {
    if (!artwork) {
        return null;
    }

    return (
        <div
            className="modal-background"
            onMouseDown={onClose}
        >
            <article
                className="artwork-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="artwork-modal-title"
                onMouseDown={event => event.stopPropagation()}
            >
                <button
                    className="close-button"
                    type="button"
                    onClick={onClose}
                    aria-label="Close artwork details"
                >
                    ×
                </button>

                <img
                    src={artwork.imageUrl}
                    alt={artwork.altText}
                />

                <div className="artwork-information">
                    <h2 id="artwork-modal-title">
                        {artwork.title}
                    </h2>

                    <p>{artwork.year}</p>
                    <p>{artwork.medium}</p>
                    <p>{artwork.dimensions}</p>
                    <p>{artwork.description}</p>
                </div>
            </article>
        </div>
    );
}

// To create the title and text links on the Other media page:
function OtherMedia() {
    return (
        <section>
            <h1 className="other-media-title">Other media</h1>

            <nav
                className="other-media-links"
                aria-label="Other media categories"
            >
                <Link to="/lithographs">Lithographs</Link>
                <Link to="/photographs">Photographs</Link>
                <Link to="/collages">Collages</Link>
                <Link to="/music">Music</Link>
                <Link to="/videos">Videos</Link>
            </nav>
        </section>
    );
}

// To create the titles, links and audioplayer for the Music page:
function Music() {
    const {
        data: songs,
        loading,
        error
    } = useApi('/api/songs');

    const [currentSong, setCurrentSong] =
        useState(null);

    const audioPlayer = useRef(null);

    useEffect(() => {
        if (!currentSong || !audioPlayer.current) {
            return;
        }

        audioPlayer.current.load();

        // Playback can occasionally be blocked by browser settings.
        audioPlayer.current.play().catch(() => {
            // The controls remain available if automatic playback
            // following the click is blocked.
        });
    }, [currentSong]);

    return (
        <section>
            <h1 className="music-title">Music</h1>

            <LoadingMessage
                loading={loading}
                error={error}
            />

            <div className="song-layout">
                <ol className="song-list">
                    {songs.map(song => (
                        <li key={song.id}>
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentSong(song)
                                }
                            >
                                <span>{song.title}</span>
                                <span>{song.year}</span>
                            </button>
                        </li>
                    ))}
                </ol>

                {currentSong && (
                    <section
                        className="audio-player"
                        aria-live="polite"
                    >
                        <h2>{currentSong.title}</h2>
                        <p>{currentSong.description}</p>

                        <audio
                            ref={audioPlayer}
                            controls
                            preload="metadata"
                            src={currentSong.audioUrl}
                        >
                            Your browser does not support audio
                            playback.
                        </audio>
                    </section>
                )}
            </div>
        </section>
    );
}

function Videos() {
    const {
        data: videos,
        loading,
        error
    } = useApi('/api/videos');

    return (
        <section>
            <h1>Videos</h1>

            <LoadingMessage
                loading={loading}
                error={error}
            />

            <div className="video-list">
                {videos.map(video => (
                    <article key={video.id}>
                        <h2>{video.title}</h2>

                        <video
                            controls
                            preload="metadata"
                            poster={video.posterUrl}
                        >
                            <source
                                src={video.videoUrl}
                                type="video/mp4"
                            />

                            Your browser does not support video
                            playback.
                        </video>

                        <p>{video.year}</p>
                        <p>{video.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

function Writing() {
    const {
        data: writings,
        loading,
        error
    } = useApi('/api/writings');

    return (
        <section>
            <h1>Writing</h1>

            <LoadingMessage
                loading={loading}
                error={error}
            />

            <div className="writing-list">
                {writings.map(writing => (
                    <article key={writing.id}>
                        <h2>{writing.title}</h2>
                        <p>{writing.year}</p>
                        <p className="excerpt">
                            {writing.excerpt}
                        </p>
                        <p>{writing.body}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

function Biography() {
    return (
        <section className="biography">
            <h1 className="biography-title">Biography</h1>

            <p>
                Alex Williamson graduated from OCAD University in 2013 with a Bachelor of Fine Arts degree with a major in Drawing and Painting.  He has shown his work in Toronto and Ottawa at Project Gallery, OCAD University, and Orange Art Gallery, among other spaces.
            </p>
        </section>
    );
}

function CV() {
    return (
        <section className="cv">
            <h1 className="cv-title">CV</h1>

            <h1 className="cv-section">Education</h1>

            <p>OCAD University, Bachelor of Fine Arts (Major in Drawing and Painting), 2010-2013</p>
            <p>Glasgow School of Art, Student Mobility/Exchange Program, Fall semester of 2011</p>
            <p>University of British Columbia, Bachelor of Arts, 2009-2010</p>

            <h1 className="cv-section">Exhibition History</h1>

            <p>General Artist Exhibition, Orange Art Gallery, Ottawa, 2014</p>
            <p>Rivet 4, OCADU Student Press, Toronto, 2013</p>
            <p>Figureworks 2013, St. Brigid’s Centre for the Arts, Ottawa, 2013</p>
 	    <p>Experiencing Perspectives, Mercedes Benz Financial Services, Mississauga, 2013</p>
	    <p>How Do I Look? OCAD University, 2013</p>
            <p>Nuit Blanche: Open Studios, 36 Chambers, 2013</p>
	    <p>Abstract Implications III: Round Two, Project Gallery, 2013</p>
	    <p>Abstract Implications III: Round One, Gallery 1313, 2013</p>
	    <p>Two Man Show, Go Lounge, Toronto, Summer 2013</p>
	    <p>Spring Fling: Inaugural Exhibition, Project Gallery, Toronto, 2013</p>
    	    <p>GradEx, OCAD University, Toronto, 2013</p>
	    <p>Retrospective Show, Great Hall, OCAD University, Toronto, 2013</p>
	    <p>Best Worst Art Works, OCAD University Transit Space, Toronto, 2013</p>
	    <p>Big Things Have Small Beginnings, Norman Felix Gallery, Toronto, 2013</p>
	    <p>Look Inside, OCAD University, Toronto, 2012</p>
	    <p>Awenda-Inspired, Awenda Provincial Park, 2012</p>
	    <p>Art of the Figure, Great Hall, OCAD University, Toronto, 2011</p>
	    <p>Retrospective Show, Great Hall, OCAD University, Toronto, 2010</p>

            <h1 className="cv-section">Related Employment</h1>

            <p>Chalk Wall Project, Paradigm Public Relations, Toronto, 2012</p>
        </section>
    );
}

function ArtworkCategory({ title, category }) {
    const {
        data: artworks,
        loading,
        error
    } = useApi(
        `/api/artworks?category=${encodeURIComponent(category)}`
    );

    const [selectedArtwork, setSelectedArtwork] = useState(null);

    return (
        <section>
            <h1 className="artwork-category-title">{title}</h1>

            <LoadingMessage
                loading={loading}
                error={error}
            />

            <div className="artwork-grid">
                {artworks.map(artwork => (
                    <button
                        className="artwork-card"
                        type="button"
                        key={artwork.id}
                        onClick={() =>
                            setSelectedArtwork(artwork)
                        }
                        aria-label={`Open details for ${artwork.title}`}
                    >
                        <img
                            src={artwork.thumbnailUrl}
                            alt={artwork.altText}
                        />

                        <span>{artwork.title}</span>
                    </button>
                ))}
            </div>

            <ArtworkModal
                artwork={selectedArtwork}
                onClose={() => setSelectedArtwork(null)}
            />
        </section>
    );
}

function NotFound() {
    return (
        <section>
            <h1>Page not found</h1>
            <p>
                <Link to="/">Return to the home page</Link>
            </p>
        </section>
    );
}

export default function App() {
    return (
        <>
            <Header />

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/paintings"
                        element={
			    <ArtworkCategory
			        title="Paintings"
			        category="painting"
		            />
			}
                    />
	            <Route
                        path="/drawings"
                        element={
			    <ArtworkCategory
			        title="Drawings"
			        category="drawing"
		            />
			}
                    />
	            <Route
                        path="/sculptures"
                        element={
			    <ArtworkCategory
			        title="Sculptures"
			        category="sculpture"
		            />
			}
v                   />
	            <Route
                        path="/other-media"
                        element={<OtherMedia />}
                    />
	    	    <Route
    			path="/biography"
    			element={<Biography />}
		    />
	    	    <Route
    			path="/cv"
    			element={<CV />}
		    />
	            <Route
                        path="/lithographs"
                        element={
			    <ArtworkCategory
			        title="Lithographs"
			        category="lithograph"
		            />
			}
                    />
	            <Route
                        path="/photographs"
                        element={
			    <ArtworkCategory
			        title="Photographs"
			        category="photograph"
		            />
			}
                    />
	            <Route
                        path="/collages"
                        element={
			    <ArtworkCategory
			        title="Collages"
			        category="collage"
		            />
			}
                    />
                    <Route
                        path="/music"
                        element={<Music />}
                    />
                    <Route
                        path="/videos"
                        element={<Videos />}
                    />
                    <Route
                        path="/writing"
                        element={<Writing />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </>
    );
}
