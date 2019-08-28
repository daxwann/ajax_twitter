const APIUtils = require("./api_utils.js");
const FollowToggle = require("./follow_toggle.js");

class UsersSearch {
  constructor($el) {
    this.$searchEl = $el;
    this.$input = $($el.find("input")[0]);
    this.$resultList = $($el.find("ul")[0]);
    this.handleInput();
  }

  handleInput() {
    this.$input.on("input", (e) => {
      APIUtils.searchUsers($(e.currentTarget).val())
        .then(this.renderResults.bind(this));
    })
  }

  renderResults(res) {
    this.$resultList.empty();
    res.forEach((user) => {
      const $followBtn = $('<button class="follow-toggle"></button>');

      const followToggle = new FollowToggle($followBtn, {
        userId: user.id, 
        followState: (user.followed ? "followed" : "unfollowed")
      });

      const $user = $(`<li>
        <a href="/users/${user.id}">${user.username}</a>
      </li>`);

      $user.append($followBtn);

      this.$resultList.append($user);
    })
  }
}

module.exports = UsersSearch;