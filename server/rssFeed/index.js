const RSSParser = require('rss-parser');
const parser = new RSSParser();
const Article = require('../article/article');
const RSSFeed = require('./rssFeed');
require('dotenv').config({path: `.env.${process.env.NODE_ENV || 'development'}`});
const OpenAIApi = require('openai');
const keywordExtractor = require('keyword-extractor');
const nlp = require('compromise');


const addRssFeed = async (req, res) => {
    try {
        const url = req.body.url;
        if (!url) {
            return res.status(400).send("URL is required.");
        }
        const feed = new RSSFeed({url});
        await feed.save();
        return res.status(200).send(`Added RSS feed: ${url}`);
    } catch (error) {
        return res.status(400).send((`Error adding RSS feed: ${error.message}`));
    }
};

const getRssFeed = async (req, res) => {
    try {
        const {id} = req.params;
        const feed = await RSSFeed.findById(id);
        return res.status(200).send(feed);
    } catch (error) {
        return res.status(400).send("Failed to fetch url.");
    }
};


const removeRssFeed = async (req, res) => {
    try {
        const url = req.params.url;
        const feed = await RSSFeed.findOneAndUpdate(
            {url: url},
            {deleted: true},
            {new: true}
        );
        return res.status(200).send(`Removed RSS feed: ${url}`);
    } catch (error) {
        return res.status(400).send(`Error removing RSS feed: ${error.message}`);
    }
};

const listRssFeeds = async (req, res) => {
    let query = req.query || {};
    query.deleted = false;
    try {
        const feeds = await RSSFeed.find(query);
        return res.status(200).send(feeds);
    } catch (error) {
        return res.status(400).send(`Failed to fetch ${error.message}.`);
    }
};


const extractTopicsFromOpenAI = async (text) => {
    const openai = new OpenAIApi({apiKey: process.env.OPENAI_API_KEY});

    try {
        const response = await openai.completions.create({
            model: "gpt-3.5-turbo",
            prompt: `Extract the main topics from the following text:\n\n${text}\n\nTopics:`,
            max_tokens: 30,
        });

        const topics = response.data.choices[0].text.trim().split(',').map(topic => topic.trim());
        return topics;
    } catch (error) {
        console.error('Error extracting topics:', error);
        return [];
    }
};


const extractTopicsFromKeyWord = (text) => {
    const extractionResult = keywordExtractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true
    });


    return extractionResult;
};


const extractNamedEntities = (text) => {
    const item = nlp(text);

    const people = item.people().out('array');
    const places = item.places().out('array');
    const organizations = item.organizations().out('array');

    return {
        people,
        places,
        organizations
    };
};


const extractArticleFromFeed = async (req, res) => {
    let query = req.query || {};
    query.deleted = false;
    query.isUrlRetrieved = false;

    try {
        const rssFeedUrls = await RSSFeed.distinct('url', query);
        console.log(rssFeedUrls);
        let ret = [];
        for (const url of rssFeedUrls) {
            const feed = await parser.parseURL(url);
            for (const item of feed.items) {
                console.log(item.contentSnippet);
                // const topics = await extractTopicsFromOpenAI(item.contentSnippet);
                const topics = await extractTopicsFromKeyWord(item.contentSnippet);

                const entities = extractNamedEntities(item.contentSnippet);
                console.log('namedEntities', entities);

                const article = new Article({
                    title: item.title,
                    description: item.contentSnippet,
                    publicationDate: new Date(item.pubDate),
                    sourceUrl: item.link,
                    topics: topics,
                    entities: entities,
                });
                await article.save();

            }
          await RSSFeed.findOneAndUpdate(
                {url: url},
                {isUrlRetrieved: true},
                {new: true}
            );
            ret.push(url);
        }
        return res.status(200).send(`Saved article from ${ret}`);

    } catch (error) {
        console.log(error);
        return res.status(400).send(`Failed to fetch ${error.message}.`);
    }
}

module.exports = {
    addRssFeed,
    getRssFeed,
    removeRssFeed,
    listRssFeeds,
    extractArticleFromFeed
}