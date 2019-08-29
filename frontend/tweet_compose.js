const APIUtils = require("./api_utils.js");

class TweetCompose {
  constructor($formEl) {
    this.$formEl = $formEl;
    this.handleSubmit();
  }

  handleSubmit() {
    this.$formEl.on("submit", (e) => {
      e.preventDefault();

      const formData = $(e.currentTarget).serializeJSON();
      this.submit(formData);
    });
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