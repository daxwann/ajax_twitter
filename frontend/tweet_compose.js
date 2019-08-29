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

  handleInput() {
    this.$formEl.on("input", ".tweet-input_content", (e) => {
      const content = $(e.currentTarget).val();
      this.checkCharCount(content);
    });
  }

  checkCharCount(content) {
    const charsLeft = 150;
    charsLeft -= content.length;
    this.displayCharsLeft(charsLeft);
  }

  displayCharsLeft(charsLeft) {
    const $charsLeftEl = $(".chars-left");
    
    if (charsLeft < 0) {
      $charsLeftEl.text(`You have exceeded max 150 characters!`);
      $charsLeftEl.addClass(".warning");
    } else {
      $charsLeftEl.text(`${charsLeft} characters left`);
      $charsLeftEl.removeClass(".warning");
    }
  }

  disableSubmit() {
    this.$formEl.off("submit");
    $(".tweet-input_submit").prop("disabled", true);
  }

  enableSubmit() {
    this.handleSubmit();
    $(".tweet-input_submit").prop("disabled", false);
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