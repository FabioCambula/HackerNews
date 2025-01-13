import axios from "axios";
import _ from "lodash";

const newsList = document.getElementById("news-list");
const loadMoreButton = document.getElementById("load-more");
let newsIds = [];
let currentIndex = 0;
const NEWS_PER_PAGE = 10;
//lista id news
const fetchNewsIds = async () => {
  try {
    const response = await axios.get(
      "https://hacker-news.firebaseio.com/v0/newstories.json"
    );
    newsIds = response.data;
    displayNews();
  } catch (error) {
    console.error("Error fetching news IDs:", error);
  }
};

// dettagli news
const fetchNewsDetails = async (id) => {
  try {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching news details:", error);
  }
};

//visualizzazione news
const displayNews = async () => {
  const newsToShow = _.slice(
    newsIds,
    currentIndex,
    currentIndex + NEWS_PER_PAGE
  );
  const newsPromises = newsToShow.map((id) => fetchNewsDetails(id));
  const newsDetails = await Promise.all(newsPromises);

  newsDetails.forEach((news) => {
    const newsItem = document.createElement("li");
    newsItem.innerHTML = `
      <h2><a href="${news.url}" target="_blank">${news.title}</a></h2>
      <p>${new Date(news.time * 1000).toLocaleString()}</p>
    `;
    newsList.appendChild(newsItem);
  });

  currentIndex += NEWS_PER_PAGE;
};

// pulsante load more
loadMoreButton.addEventListener("click", displayNews);


fetchNewsIds();
