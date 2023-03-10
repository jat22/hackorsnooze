"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage(storyList.stories);
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitStory (evt){
  $allStoriesList.hide()
  $newStoryForm.show();
}

$navSubmit.on('click', navSubmitStory)

function navFavorites() {
  hidePageComponents();

  putStoriesOnPage(currentUser.favorites);
}

$navFavorites.on('click', navFavorites)


function navMyStories() {
  hidePageComponents()
  putStoriesOnPage(currentUser.ownStories)
}

// **************************fix typo and update across app (nave to nav)
$navMyStories.on('click', navMyStories);