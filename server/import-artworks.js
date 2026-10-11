const fs = require('fs');
const path = require('path');

const database = require('./database');
const artworks = require('./artworks.json');

const saveArtwork = database.prepare(`
    INSERT INTO artworks (
        title,
        slug,
        year,
        category,
        medium,
        dimensions,
        description,
        alt_text,
        thumbnail_url,
        image_url,
        display_order,
        is_featured
    )
    VALUES (
        @title,
        @slug,
        @year,
        @category,
        @medium,
        @dimensions,
        @description,
        @altText,
        @thumbnailUrl,
        @imageUrl,
        @displayOrder,
        @isFeatured
    )
    ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        year = excluded.year,
        category = excluded.category,
        medium = excluded.medium,
        dimensions = excluded.dimensions,
        description = excluded.description,
        alt_text = excluded.alt_text,
        thumbnail_url = excluded.thumbnail_url,
        image_url = excluded.image_url,
        display_order = excluded.display_order,
        is_featured = excluded.is_featured
`);

function mediaUrlToFilePath(mediaUrl) {
    const relativePath = mediaUrl.replace(/^\/media\//, '');

    return path.join(
        __dirname,
        'media',
        relativePath
    );
}

function validateArtwork(artwork, index) {
    const requiredTextFields = [
        'title',
        'slug',
        'category',
        'altText',
        'thumbnailUrl',
        'imageUrl'
    ];

    for (const field of requiredTextFields) {
        if (
            typeof artwork[field] !== 'string' ||
            artwork[field].trim() === ''
        ) {
            throw new Error(
                `Artwork ${index + 1} is missing "${field}".`
            );
        }
    }

    if (
        artwork.isFeatured !== 0 &&
        artwork.isFeatured !== 1
    ) {
        throw new Error(
            `"isFeatured" must be 0 or 1 for "${artwork.title}".`
        );
    }

    const thumbnailPath =
        mediaUrlToFilePath(artwork.thumbnailUrl);

    const imagePath =
        mediaUrlToFilePath(artwork.imageUrl);

    if (!fs.existsSync(thumbnailPath)) {
        throw new Error(
            `Thumbnail not found for "${artwork.title}": ` +
            thumbnailPath
        );
    }

    if (!fs.existsSync(imagePath)) {
        throw new Error(
            `Image not found for "${artwork.title}": ` +
            imagePath
        );
    }
}

const importArtworks = database.transaction(
    artworkRecords => {
        for (let index = 0; index < artworkRecords.length; index++) {
            const artwork = artworkRecords[index];

            validateArtwork(artwork, index);

            saveArtwork.run({
                title: artwork.title,
                slug: artwork.slug,
                year: artwork.year ?? null,
                category: artwork.category,
                medium: artwork.medium ?? null,
                dimensions: artwork.dimensions ?? null,
                description: artwork.description ?? null,
                altText: artwork.altText,
                thumbnailUrl: artwork.thumbnailUrl,
                imageUrl: artwork.imageUrl,
                displayOrder: artwork.displayOrder ?? 0,
                isFeatured: artwork.isFeatured ?? 0
            });

            console.log(`Saved: ${artwork.title}`);
        }
    }
);

try {
    importArtworks(artworks);

    console.log(
        `Successfully imported ${artworks.length} artwork record(s).`
    );
} catch (error) {
    console.error('Artwork import failed:');
    console.error(error.message);
    process.exitCode = 1;
} finally {
    database.close();
}
