// Exhibition data
export const exhibitions = [
    {
        id: 1,
        title: "Masters of Renaissance",
        description: "A comprehensive collection showcasing the greatest works of the Italian Renaissance period, featuring masterpieces that defined an era of artistic innovation and human achievement.",
        startDate: "2024-01-15",
        endDate: "2024-04-15",
        status: "past",
        curator: "Dr. Maria Rodriguez",
        featuredArtists: [2], // artist IDs
        featuredArtworks: [2], // artwork IDs
        theme: "Renaissance Innovation",
        location: "Main Gallery Hall A",
        ticketPrice: 25,
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
        ],
        highlights: [
            "Rare display of Renaissance techniques",
            "Interactive digital reconstructions",
            "Expert-led gallery talks"
        ]
    },
    {
        id: 2,
        title: "Post-Impressionist Revolution",
        description: "Explore the bold colors and emotional depth of Post-Impressionism through the works of van Gogh and his contemporaries who revolutionized modern art.",
        startDate: "2024-05-01",
        endDate: "2024-08-01",
        status: "past",
        curator: "Prof. James Thompson",
        featuredArtists: [1, 3],
        featuredArtworks: [1, 3],
        theme: "Color and Emotion",
        location: "Modern Art Wing",
        ticketPrice: 20,
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/800px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
        ],
        highlights: [
            "Immersive light installations",
            "Artist's technique demonstrations",
            "Audio guides with artist insights"
        ]
    },
    {
        id: 3,
        title: "East Meets West: Global Perspectives",
        description: "A celebration of artistic exchange between Eastern and Western traditions, featuring ukiyo-e prints alongside European masterpieces.",
        startDate: "2024-09-15",
        endDate: "2024-12-15",
        status: "current",
        curator: "Dr. Yuki Tanaka",
        featuredArtists: [1, 2, 3],
        featuredArtworks: [1, 2, 3],
        theme: "Cultural Fusion",
        location: "International Gallery",
        ticketPrice: 22,
        images: [
            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/800px-The_Great_Wave_off_Kanagawa.jpg"
        ],
        highlights: [
            "Cross-cultural art dialogues",
            "Traditional craft demonstrations",
            "Multilingual audio guides"
        ]
    },
    {
        id: 4,
        title: "Contemporary Visions",
        description: "Showcasing emerging artists who are pushing the boundaries of contemporary art with innovative techniques and bold new perspectives.",
        startDate: "2025-02-01",
        endDate: "2025-05-01",
        status: "upcoming",
        curator: "Sarah Chen",
        featuredArtists: [], // To be announced
        featuredArtworks: [],
        theme: "Innovation and Expression",
        location: "Contemporary Space",
        ticketPrice: 18,
        images: [],
        highlights: [
            "Live artist performances",
            "Interactive installations",
            "Artist meet-and-greets"
        ]
    }
];