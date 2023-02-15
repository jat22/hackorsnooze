"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage(storyList.stories);
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="delete hidden">
          <i class="delete fa-solid fa-trash-can"></i>
        </span>
        <span class="no-fav hidden">
          <i class="no-fav fa-regular fa-star"></i>
        </span>
        <span class="fav hidden">
          <i class="fav fa-solid fa-star"></i>
        </span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage(listofStories) {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();
  if(currentUser === undefined){
    for (let story of listofStories){
      const $story = generateStoryMarkup(story)
      $allStoriesList.append($story)
    }
  } else {
  // loop through all of our stories and generate HTML for them
    for (let story of listofStories) {
      const favorite = currentUser.favorites.find(function(fav){
        return (fav.storyId === story.storyId)
      })
      const myStory = currentUser.ownStories.find(function(own){
        return (own.storyId === story.storyId)
      })

      if(favorite !== undefined){
          const $story = generateStoryMarkup(story);
          $story.children('.fav').removeClass('hidden');
          if(myStory !== undefined){
            $story.children('.delete').removeClass('hidden');
            $allStoriesList.append($story);
        } else {
            $allStoriesList.append($story);
        }
      } else {
          const $story = generateStoryMarkup(story);
          $story.children('.no-fav').removeClass('hidden');
          if(myStory !== undefined){
            $story.children('.delete').removeClass('hidden');
            $allStoriesList.append($story);
          } else {
            $allStoriesList.append($story);
        }
      } 
    } 
  } 
  $allStoriesList.show();
}



async function submitNewStory (evt){
  console.debug("submit", evt)
  evt.preventDefault();
  const newStory = {
    author : $('#author').val(),
    title : $('#title').val(),
    url : $('#url').val()
    }

  const story = await storyList.addStory(currentUser, newStory);
  const storyMarkup = generateStoryMarkup(story);
  $allStoriesList.prepend(storyMarkup);
  $newStoryForm.trigger('reset');
  $newStoryForm.hide();
  getAndShowStoriesOnStart()
}

$newStoryForm.on('submit', submitNewStory);

$('ol').on('click', async function(evt){
  await currentUser.favAndRemoveActions(evt)
});




