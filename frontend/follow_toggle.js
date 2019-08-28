const APIUtils = require("./api_utils.js");

class FollowToggle {
  constructor($el, options) {
    this.userId = $el.data("userId") || options.userId;
    this.followState = $el.data("initialFollowState") || options.followState;
    this.$followEl = $el;
    this.render();
    this.handleClick();
  }

  render() {
    if (this.followState === "followed") {
      this.$followEl.text("Unfollow");
    } else if (this.followState === "unfollowed") {
      this.$followEl.text("Follow");
    }

    this.$followEl.prop("disabled", false);
  }

  handleClick() {
    this.$followEl.on("click", (e) => {
      e.preventDefault();

      //disable button until ajax response
      this.$followEl.prop("disabled", true);

      if (this.followState === "unfollowed") {
        APIUtils.followUser(this.userId).then(() => {
          this.followState = "followed";
          this.render();
        });
      } else if (this.followState === "followed") {
        APIUtils.unfollowUser(this.userId).then(() => {
          this.followState = "unfollowed";
          this.render();
        });
      }
    });
  }
}

module.exports = FollowToggle;