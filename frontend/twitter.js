const FollowToggle = require("./follow_toggle.js");
const UsersSearch = require("./users_search.js");

$(() => {
  $(".follow-toggle").each((idx, el) => {
    const followToggle = new FollowToggle($(el));
  });

  $("nav.users-search").each((idx, el) => {
    const usersSearch = new UsersSearch($(el));
  })
});