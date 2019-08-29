const FollowToggle = require("./follow_toggle.js");
const UsersSearch = require("./users_search.js");
const TweetCompose = require("./tweet_compose.js");

$(() => {
  $(".follow-toggle").each((idx, el) => {
    const followToggle = new FollowToggle($(el));
  });

  $("nav.users-search").each((idx, el) => {
    const usersSearch = new UsersSearch($(el));
  })

  $("form.tweet-compose").each((idx, el) => {
    const tweetCompose = new TweetCompose($(el));
  })
});