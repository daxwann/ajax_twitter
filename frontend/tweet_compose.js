const APIUtils = require("./api_utils.js");

class TweetCompose {
  constructor($formEl) {
    this.$formEl = $formEl;
    this.$atResult = $($formEl.find(".search-result")[0]);
    this.submitOn = true;
    this.mentions = [];
    this.handleSubmit();
    this.handleInput();
  }

  handleSubmit() {
    this.$formEl.on("submit", (e) => {
      e.preventDefault();

      const formData = $(e.currentTarget).serializeJSON();
      this.submit(formData);
    });
  }

  handleInput() {
    this.$formEl.on("input", ".tweet-input_content", (e) => {
      const content = $(e.currentTarget).val();
      this.checkLastMention(content);
      this.checkCharCount(content);
    });
  }

  checkLastMention(content) {
    // match the last occurence of @
    const lastAt = /([^\S]|^)\@([0-9A-Za-z\_]+)$/g
    const result = lastAt.exec(content);
    
    if (result) {
      APIUtils.searchUsers(result[2]).then(this.renderResult.bind(this));
    } else {
      this.$atResult.empty();
    }
  }

  checkAllMentions(content) {
    
  }

  renderResult(res) {
    this.$atResult.empty();
    res.forEach((user) => {
      const $user = $(`<li>
        <a href="/users/${user.id}">${user.username}</a>
      </li>`);
      this.$atResult.append($user);
    });
  }

  checkCharCount(content) {
    let charsLeft = 150;
    charsLeft -= content.length;

    charsLeft < 0 ? this.disableSubmit() : this.enableSubmit();
    this.renderCharsLeft(charsLeft);
  }

  renderCharsLeft(charsLeft) {
    const $charsLeftEl = $(".chars-left");
    
    if (charsLeft < 0) {
      $charsLeftEl.text(`You have exceeded max 150 characters!`);
      $charsLeftEl.addClass("warning");
    } else {
      $charsLeftEl.text(`${charsLeft} characters left`);
      $charsLeftEl.removeClass("warning");
    }
  }

  disableSubmit() {
    if (this.submitON) {
      this.$formEl.off("submit");
      $(".tweet-input_submit").prop("disabled", true);
      this.submitON = false;
    }
  }

  enableSubmit() {
    if (!this.submitOn) {
      this.handleSubmit();
      $(".tweet-input_submit").prop("disabled", false);
      this.submitOn = true;
    }
  }

  submit(formData) {

    // disable all form inputs
    $(".tweet-input").prop("disabled", true);

    APIUtils.createTweet(formData).then(this.handleSuccess.bind(this));
  }

  handleSuccess(res) {
    this.renderTweet(res);
    this.clearInput();
    $(".tweet-input").prop("disabled", false);
  }

  renderTweet(res) {
    const $tweet = $(`<li>${JSON.stringify(res)}</li>`);
    $(this.$formEl.data("feedId")).prepend($tweet);
  }

  clearInput() {
    $(".tweet-input_content").val('');
    $(".tweet-input_mentions > option").prop("selected", false);
  }
}

module.exports = TweetCompose;