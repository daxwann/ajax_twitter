/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./frontend/twitter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./frontend/api_utils.js":
/*!*******************************!*\
  !*** ./frontend/api_utils.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

const APIUtils = {
  followUser: id => {
    return $.ajax({
          method: "POST",
          url: `/users/${id}/follow`,
          dataType: "json"
    });
  },

  unfollowUser: id => {
    return $.ajax({
      method: "DELETE",
      url: `/users/${id}/follow`,
      dataType: "json"
    });
  },

  searchUsers: queryVal => {
    return $.ajax({
      method: "GET",
      url: `/users/search`,
      data: {query: queryVal},
      dataType: "json"
    });
  },

  createTweet: formData => {
    return $.ajax({
      method: "POST",
      url: "/tweets",
      data: formData,
      dataType: "json"
    })
  }
}

module.exports = APIUtils;

/***/ }),

/***/ "./frontend/follow_toggle.js":
/*!***********************************!*\
  !*** ./frontend/follow_toggle.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtils = __webpack_require__(/*! ./api_utils.js */ "./frontend/api_utils.js");

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

/***/ }),

/***/ "./frontend/tweet_compose.js":
/*!***********************************!*\
  !*** ./frontend/tweet_compose.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtils = __webpack_require__(/*! ./api_utils.js */ "./frontend/api_utils.js");

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
    let text = $target.text();
    html = text.replace(at, '$1<span class="highlight">$2</span>');
    
    $target.html(html);
  }

  getCaretCharacterOffsetWithin(element) {
    let caretOffset = 0;
    if (typeof window.getSelection != "undefined") {
        let range = window.getSelection().getRangeAt(0);
        console.log(range);
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
            } else {
                 range.setEnd(elem, caretPos);
                 caretPos = 0;
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
};

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

/***/ }),

/***/ "./frontend/twitter.js":
/*!*****************************!*\
  !*** ./frontend/twitter.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FollowToggle = __webpack_require__(/*! ./follow_toggle.js */ "./frontend/follow_toggle.js");
const UsersSearch = __webpack_require__(/*! ./users_search.js */ "./frontend/users_search.js");
const TweetCompose = __webpack_require__(/*! ./tweet_compose.js */ "./frontend/tweet_compose.js");

$(() => {
  $(".follow-toggle").each((idx, el) => {
    const followToggle = new FollowToggle($(el));
  });

  $("nav.users-search").each((idx, el) => {
    const usersSearch = new UsersSearch($(el));
  })

  $("form.tweet-compose").each((idx, el) => {
    const tweetCompose = new TweetCompose($(el));
  })
});

/***/ }),

/***/ "./frontend/users_search.js":
/*!**********************************!*\
  !*** ./frontend/users_search.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const APIUtils = __webpack_require__(/*! ./api_utils.js */ "./frontend/api_utils.js");
const FollowToggle = __webpack_require__(/*! ./follow_toggle.js */ "./frontend/follow_toggle.js");

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

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map