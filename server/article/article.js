const mongoose = require("mongoose");

const { Schema } = mongoose;

const ArticleSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    title: { type: String},
    description:  { type: String},
    publicationDate:  { type: Date},
    sourceUrl: { type: String},
    topics: [{ type: String}],
    entities: {
        people: [{ type: String}],
        locations: [{ type: String}],
        organizations: [{ type: String}],
    }
});

const Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
