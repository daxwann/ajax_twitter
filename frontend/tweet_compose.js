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
      let caretPos = this.getCaretCharacterOffsetWithin(e.currentTarget);
      this.highlightAllMentions(e.currentTarget);
      this.setCaretPosition(e.currentTarget, caretPos);
      // const selectedMention = this.parseCurrentMention(value);
      // this.searchForUsers(selectedMention);
      // this.checkCharCount(value);
    });
  }

  // PARSE INPUT
  escape(s) {
    let lookup = {
        '&': "&amp;",
        '"': "&quot;",
        '<': "&lt;",
        '>': "&gt;"
    };
    return s.replace( /[&"<>]/g, (c) => lookup[c] );
  } 

  highlightAllMentions(targetElem) {
    const $target = $(targetElem);
    // regex
    const at = /([\s]|^)(\@[0-9A-Za-z\_]+)/g;
    const highlighted = /\<span class\=\"highlight\"\>([\S]+)\<\/span\>/g;
    
    // clear highlights
    let html = $target.html();
    html = html.replace(highlighted, "$1");
    $target.html(html);

    // highlight words begining with @
    let text = this.escape($target.text());
    html = text.replace(at, '$1<span class="highlight">$2</span>');

    $target.html(html);
  }

  getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        let range = window.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        let textRange = document.selection.createRange();
        let preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  }

  createRange(elem, caretPos, range) {
    console.log(elem);
    console.log(caretPos);
    console.log(range);
    if (!range) {
        range = document.createRange()
        range.selectNode(elem);
        range.setStart(elem, 0);
    }

    if (caretPos === 0) {
        range.setEnd(elem, caretPos);
    } else if (elem && caretPos > 0) {
        if (elem.nodeType === elem.TEXT_NODE) {
            if (elem.textContent.length < caretPos) {
                caretPos -= elem.textContent.length;
                console.log("text");
            } else {
                 range.setEnd(elem, caretPos);
                 caretPos = 0;
                 console.log("text2");
            }
        } else {
            for (var lp = 0; lp < elem.childNodes.length; lp++) {
                range = this.createRange(elem.childNodes[lp], caretPos, range);

                if (caretPos === 0) {
                   break;
                }
            }
        }
   } 

   return range;
  }

  setCaretPosition(elem, caretPos) {
    if (caretPos >= 0) {
        let selection = window.getSelection();

        let range = this.createRange(elem, caretPos);

        if (range) {
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
};


  parseCurrentMention(content, selectedIdx) {
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