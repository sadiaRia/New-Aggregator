const Article = require('../article/article');



const filterArticles = async (req,res) => {
    try {
        const keyword = req.query.keyword;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate

        const query = {};

        if (keyword) {
            query.$or = [
                {title: {$regex: keyword, $options: 'i'}},
                {description: {$regex: keyword, $options: 'i'}},
                {topics: {$regex: keyword, $options: 'i'}},
            ];
        }
        if (startDate || endDate) {
            query.publicationDate = {};
            if (startDate) query.publicationDate.$gte = new Date(startDate);
            if (endDate) query.publicationDate.$lte = new Date(endDate);
        }
        const matchedArticle = await Article.find(query);
        return res.status(200).send(matchedArticle);

    }catch(e){
        return res.status(400).send(`Failed to fetch ${error.message}.`);

    }
};

module.exports = {
    filterArticles
}