const mongoose = require("mongoose");

const { Schema } = mongoose;

const rssFeedSchema = new Schema({
    createdAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },
    deleted: { type: Boolean, default: false },
    url: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^(ftp|http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },    isUrlRetrieved: { type: Boolean, default: false }
});

const RSSFeed = mongoose.model('RSSFeed', rssFeedSchema);

module.exports = RSSFeed;
