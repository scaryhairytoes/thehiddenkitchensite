import React from 'react'

export function SchemaMarkup() {
    const localBusinessSchema = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        '@id': 'https://thehiddenkitchen62.com/#restaurant',
        name: 'The Hidden Kitchen',
        image: 'https://thehiddenkitchen62.com/logo.svg',
        url: 'https://thehiddenkitchen62.com',
        telephone: '+16186814208',
        email: 'events@thehiddenkitchen62.com',
        priceRange: '$$',
        servesCuisine: ['American', 'Comfort Food', 'Pizza', 'Cocktails'],
        address: {
            '@type': 'PostalAddress',
            streetAddress: '131 S Division St',
            addressLocality: 'Carterville',
            addressRegion: 'IL',
            postalCode: '62918',
            addressCountry: 'US',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 37.7601,
            longitude: -89.0784,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Wednesday', 'Thursday'],
                opens: '16:00',
                closes: '22:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Friday', 'Saturday'],
                opens: '16:00',
                closes: '23:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Sunday',
                opens: '11:00',
                closes: '20:00',
            },
        ],
        sameAs: [
            'https://www.facebook.com/p/The-Hidden-Kitchen-61556851624462/',
            'https://www.instagram.com/thehiddenkitchen62/',
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
    )
}

export default SchemaMarkup