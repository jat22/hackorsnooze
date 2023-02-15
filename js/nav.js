"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $newStoryForm.hide();
  $favoriteStoriesList.hide();
  $myStoriesList.hide();
  putStoriesOnPage();
  // currentUser.setUIfavs()
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


// ************************remame to navFavorites
function showFavoriteStories(){
  $allStoriesList.hide();
  $myStoriesList.hide()
  $newStoryForm.hide();
  $favoriteStoriesList.empty();

  for (let story of currentUser.favorites) {
    const $story = generateFavoriteMarkup(story);
    $favoriteStoriesList.append($story);
  }
  $favoritesLoadingMsg.hide();
  $favoriteStoriesList.show();
}

$navFavorites.on('click', showFavoriteStories);


// ***************************rename this to navMyStories
function showMyStories(){
  $allStoriesList.hide();
  $favoriteStoriesList.hide();
  $newStoryForm.hide();
  $myStoriesLoadingMsg.show();
  $myStoriesList.empty();

  for (let story of currentUser.ownStories) {
    const $story = generateMyStoriesMarkup(story);
    $myStoriesList.append($story);
  }
  $myStoriesLoadingMsg.hide();
  $myStoriesList.show();
}

// **************************fix typo and update across app (nave to nav)
$naveMyStories.on('click', showMyStories);