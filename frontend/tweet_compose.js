const APIUtils = require("./api_utils.js");

class TweetCompose {
  constructor($formEl) {
    this.$formEl = $formEl;
    this.$suggestionList = $($formEl.find(".suggested-users")[0]);
    this.submitOn = true;
    this.handleSubmit();
    this.handleInput();
  }

  // EVENTS

  handleSubmit() {
    this.$formEl.on("submit", (e) => {
      e.preventDefault();

      this.$atResult.empty();
      const formData = $(e.currentTarget).serializeJSON();
      this.submit(formData);
    });
  }

  handleInput() {
    this.$formEl.on("input", ".tweet-content", (e) => {
      const value = $(e.currentTarget).html();
      this.highlightMentions(value);
      const selectedMention = this.parseCurrentMention(value);
      this.searchForUsers(selectedMention);
      this.checkCharCount(value);
    });
  }

  // PARSE INPUT

  findMention(content, selectedIdx) {
    // get content before and after the selected position
    console.log(selectedIdx);
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

    console.log(selectedContent);

    return selectedContent;
  }

  // SEARCH SUGGESTIONS

  searchForUsers(selectedMention) {
    if (selectedMention) {
      APIUtils.searchUsers(selectedMention).then((res) => {
        this.handleSearchResult(selectedMention, res);
      });
    } else {
      this.$suggestionList.empty();
    }
  }

  handleSearchResult(selectedMention, res) {
    this.$atResult.empty();
    res.forEach((user) => {
      this.renderSuggestedUser(user);
      this.checkExactMatch(user, selectedMention);
    });
  }

  // USER SUGGESTIONS

  renderSuggestedUser(user) {
    const $user = $(`<li>
        <a href="/users/${user.id}">@${user.username}</a>
      </li>`);
    this.$atResult.append($user);
  }

  // FIND ALL MENTIONED USERS

  
  // CHARACTERS LEFT

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

  // SUBMIT

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