const RSSParser = require('rss-parser');
const parser = new RSSParser();
const Article = require('../article/article');
const RSSFeed = require('./rssFeed');


const addRssFeed = async (req, res) => {
    try {
        const url = req.body.url;
        if(!url){
            return res.status(400).send("URL is required.");
        }
        const feed = new RSSFeed({ url });
        await feed.save();
        return res.status(200).send(`Added RSS feed: ${url}`);
    } catch (error) {
        return res.status(400).send((`Error adding RSS feed: ${error.message}`));
    }
};

const getRssFeed = async (req, res) => {
    try {
        const { id } = req.params;
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
            { url: url },
            { deleted: true },
            { new: true }
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

module.exports = {
    addRssFeed,
    getRssFeed,
    removeRssFeed,
    listRssFeeds,
}