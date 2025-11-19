import express from "express";
import axios from "axios";

const router = express.Router();

const categoryMapping = {
    world: null,
    technology: "technology",
    sports: "sports",
    science: "science",
    entertainment: "entertainment",
    politics: "politics",
    business: "business",
    health: "health"
};

router.get("/news/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const newsdataCategory = categoryMapping[category];
        console.log("Category requested:", category, "Mapped to:", newsdataCategory);

        // Build params dynamically
        const params = {
            apikey: process.env.NEWSDATA_API_KEY,
            language: "en"
        };

        // Only add category if it exists
        if (newsdataCategory) {
            params.category = newsdataCategory;
            params.size = 50; // categories allow size up to 50
        }

        const response = await axios.get("https://newsdata.io/api/1/news", { params });

        console.log("Response received, results count:", response.data.results?.length);

        const results = response.data.results || [];

        const transformedData = {
            data: {
                children: results.map(article => ({
                    data: {
                        id: article.article_id,
                        title: article.title,
                        author: article.creator?.[0] || article.source_id,
                        created_utc: new Date(article.pubDate).getTime() / 1000,
                        permalink: article.link,
                        thumbnail: article.image_url,
                        selftext: article.description
                    }
                }))
            }
        };

        res.json(transformedData);
    } catch (error) {
        console.error("Backend news error:", error.response?.data || error.message);
        res.status(500).json({
            error: "Failed to fetch news",
            details: error.response?.data || error.message
        });
    }
});



export default router;
