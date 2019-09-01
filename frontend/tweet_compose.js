const APIUtils = require("./api_utils.js");

class TweetCompose {
  constructor($formEl) {
    this.$formEl = $formEl;
    this.$atResult = $($formEl.find(".search-result")[0]);
    this.submitOn = true;
    this.handleSubmit();
    this.handleInput();
  }

  handleSubmit() {
    this.$formEl.on("submit", (e) => {
      e.preventDefault();

      this.$atResult.empty();
      const formData = $(e.currentTarget).serializeJSON();
      this.submit(formData);
    });
  }

  handleInput() {
    this.$formEl.on("input click", ".tweet-input_content", (e) => {
      const value = $(e.currentTarget).val();
      const selectedMention = this.findMention(value, e.currentTarget.selectionStart)
      this.checkSelectedMention(selectedMention);
      this.checkCharCount(value);
    });
  }

  findMention(content, selectedIdx) {
    // get content before and after the selected position
    const contentBeforeSelected = content.slice(0, selectedIdx);
    const contentAfterSelected = content.slice(selectedIdx);

    // get content between @ symbol and end of word
    const toPrevAt = /(?:[\s]|^)\@([0-9A-Za-z\_]+)$/g;
    const toEnd = /^([a-zA-Z0-9\_]+)/g;
    const strAfterAt = toPrevAt.exec(contentBeforeSelected);
    const strBeforeEnd = toEnd.exec(contentAfterSelected);
    if (!strAfterAt) {
      return null;
    }

    let selectedContent = strAfterAt[1];

    if (strBeforeEnd) {
      selectedContent = selectedContent.concat(strBeforeEnd[1]);
    }

    return selectedContent;
  }

  checkSelectedMention(username) {
    if (username) {
      APIUtils.searchUsers(username).then(this.renderSearchResult.bind(this));
    } else {
      this.$atResult.empty();
    }
  }

  renderSearchResult(res) {
    this.$atResult.empty();
    res.forEach((user) => {
      const $user = $(`<li>
        <a href="/users/${user.id}">@${user.username}</a>
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