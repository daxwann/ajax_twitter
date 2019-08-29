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