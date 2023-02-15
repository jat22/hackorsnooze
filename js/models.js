"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    const url = new URL(this.url)
    return url.hostname;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }

  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  async addStory(user, newStory){ 
    const res = await axios.post(`${BASE_URL}/stories`, {
        token : user.loginToken,
        story: {
          author: newStory.author,
          title: newStory.title,
          url: newStory.url}
      })

      currentUser = await User.updateCurrentUser()

      const storyId = res.data.story.storyId;
      const title = res.data.story.title;
      const author = res.data.story.author;
      const url = res.data.story.url;
      const username = res.data.story.username
      const createdAt = res.data.story.createdAt
      return new Story ({ storyId, title, author, url, username, createdAt })
  }
}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  /** updates current user's information  */
  static async updateCurrentUser (){
      const response = await axios.get(`${BASE_URL}/users/${currentUser.username}`, 
        {params: { token : currentUser.loginToken },}
      );

      let { user } = response.data;

      return new User({
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        currentUser.loginToken
      );
  }

  async favAndRemoveActions (evt){
    const $evtTarget = $(evt.target);
    if($evtTarget.hasClass('no-fav')){
      $evtTarget.parent().toggleClass('hidden');
      $evtTarget.parent().siblings('.fav').toggleClass('hidden');

      const $favoriteID = $evtTarget.parent().parent().attr('id')

      await axios.post(`${BASE_URL}/users/${currentUser.username}/favorites/${$favoriteID}`, 
        { token : currentUser.loginToken});
      currentUser = await User.updateCurrentUser();
    }
    if($evtTarget.hasClass('fav')){
      $evtTarget.parent().toggleClass('hidden');
      $evtTarget.parent().siblings('.no-fav').toggleClass('hidden');

      const $favoriteID = $evtTarget.parent().parent().attr('id');

      await axios.delete(`${BASE_URL}/users/${currentUser.username}/favorites/${$favoriteID}`, 
        { params:{ token : currentUser.loginToken}});
      currentUser = await User.updateCurrentUser()
    }
    if($evtTarget.hasClass('delete')){
      $evtTarget.parent().parent().toggleClass('hidden');

      const $storyId = $evtTarget.parent().parent().attr('id');
      await axios.delete(`${BASE_URL}/stories/${$storyId}`, 
        { params:{ token : currentUser.loginToken}});
      currentUser = await User.updateCurrentUser()
    }
  }
}
