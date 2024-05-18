# New-Aggregator
This program aggregates news articles from various RSS feeds, extracts topics and named entities, and stores the data in MongoDB.
It provides functionalities to filter articles based on keywords or publication date and schedules periodic fetching of new articles.

- RSS FEED URL - https://feeds.megaphone.fm/newheights


## Features
- Store RSS Feed URLs
   request - post
   url - http://localhost:9000/rssFeed/
   payload - {"url":"https://feeds.megaphone.fm/newheights" }
- List of RSS Feed
   request - get
   url - http://localhost:9000/rssFeed/
- Fetch news articles from  RSS feed URLs.
  request - get
  url - http://localhost:9000/rssFeed/extract/article
- Extract topics using openai & also keyword-extractor npm package.
- Extract named entities using compromise package.
- Filter articles based on keywords or publication date.
  request - get
  url - http://localhost:9000/article/search?keyword=tiktok&startDate=2024-05-14&endDate=2024-05-17
- Schedule periodic fetching of new articles.
   add scheduler & will extract the article every 12 hour.


## Installation
1. Clone the repository:
  - git clone git@github.com:sadiaRia/News-Aggregator.git
  - cd news-aggregator
  - npm install
  - yarn dev-server / npm run dev-server
