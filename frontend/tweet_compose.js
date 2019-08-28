const APIUtils = require("./api_utils.js");

class TweetCompose {
  constructor($formEl) {
    this.$formEl = $formEl;

  }

  handleSubmit() {
    this.$form.on("submit", (e) => {
      e.preventDefault();


    });
  }

  submit() {
    APIUtil.createTweet()
  }
}

module.exports = TweetCompose;