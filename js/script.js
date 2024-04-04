'use strict';

const optTagsListSelector = '.tags.list';
let allTags = {};
let tagList;

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  console.log('Link was clicked!');
  console.log(event);

  /* remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.posts .post.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  console.log('clickedElement:', clickedElement);

  /* remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.titles a.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector:', articleSelector);

  /* find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle:', targetArticle);

  /* add class 'active' to the correct article */
  targetArticle.classList.add('active');
  console.log('active:', targetArticle);
}

function generateTitleLinks(customSelector = '') {
  /* remove contents of titleList */
  const titleList = document.querySelector('.titles');
  titleList.innerHTML = '';

  /* find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll('.post' + customSelector);

  let html = '';

  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector('.post-title').innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

    /* insert link into html variable */
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }

}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';

generateTitleLinks();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  console.log('Clicked tag:', tag);

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active');

  /* START LOOP: for each active tag link */
  activeTagLinks.forEach(function (link) {
    /* remove class active */
    link.classList.remove('active');
  });
  /* END LOOP: for each active tag link */

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  tagLinks.forEach(function (link) {
    /* add class active */
    link.classList.add('active');
  });
  /* END LOOP: for each found tag link */

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag"]');

  console.log('Found tag links:', tagLinks);

  /* START LOOP: for each link */
  tagLinks.forEach(function (link) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
  });
  /* END LOOP: for each link */
}

function generateAuthors() {
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article */
  for (let article of articles) {
    /* find author wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* make html variable with empty string */
    let html = '';
    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');
    /* generate HTML of the link */
    const authorHTML = '<a href="#author-' + author + '">' + author + '</a>';
    /* add generated code to html variable */
    html += authorHTML;
    /* insert HTML of the link into the author wrapper */
    authorWrapper.innerHTML = html;
  }
  /* END LOOP: for every article */
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author"]');

  /* START LOOP: for each link */
  authorLinks.forEach(function (link) {
    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
  });
  /* END LOOP: for each link */
}

function authorClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty array */

  /* find all articles */
  const articles = document.querySelectorAll('article');

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector('.post-tags .list');

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const tagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for (let tag of tagsArray) {

      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      /* add generated code to html variable */
      html += linkHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  tagList = document.querySelector(optTagsListSelector); // Przypisanie wartości do zmiennej globalnej tagList
  /* [NEW] add html from allTags to tagList */
  let allTagsHTML = '';

  for (let tag in allTags) {
    allTagsHTML += '<li><a href="#tag-' + tag + '">' + tag + '</a> (' + allTags[tag] + ')</li>';
  }

  tagList.innerHTML = allTagsHTML;

  // Dodanie nasłuchiwania zdarzeń do tagów po ich wygenerowaniu
  addClickListenersToTags();
}

generateTags();

generateAuthors();
addClickListenersToAuthors();

