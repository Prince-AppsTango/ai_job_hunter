import Parser from "rss-parser";
const parser = new Parser();

const fetchJobs = async () => {
  const feed = await parser.parseURL(
    "https://remoteok.com/remote-dev-jobs.rss"
  );
  return feed.items.slice(0, 5);
};

export default fetchJobs;