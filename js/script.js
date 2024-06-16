'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML)
};

const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';
const optCloudClassCount = 5;
const optCloudClassPrefix = 'tag-size-';
const optAuthorsListSelector = '.list.authors';
const optTagsListSelector = '.tags.list';

let allTags = {};
let allAuthors = {};
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

    /* find the author element */
    const articleAuthor = article.getAttribute('data-author');
    const authorHTMLData = {author: articleAuthor};
    const authorHTML = templates.authorLink(authorHTMLData);

    /* create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* insert author and link into html variable */
    html += authorHTML + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

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
  /* create a new variable allAuthors with an empty object */
  allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article */
  for (let article of articles) {
    /* get author from data-author attribute */
    const author = article.getAttribute('data-author');

    /* create HTML of the link */
    const authorHTMLData = {author: author};
    const authorHTML = templates.authorLink(authorHTMLData);

    /* add the author above the title in the article */
    const titleElement = article.querySelector('.post-title');
    const existingAuthorElement = article.querySelector('.post-author');

    if (!existingAuthorElement) {
      titleElement.insertAdjacentHTML('beforebegin', `<p class="post-author">by ${author}</p>`);
    }

    /* if author is not in allAuthors, add author with count 1, otherwise increment count */
    if (!allAuthors.hasOwnProperty(author)) {
      allAuthors[author] = 1;
    } else {
      allAuthors[author]++;
    }
  }
  /* END LOOP: for every article */

  // find list of authors in right column
  const authorList = document.querySelector(optAuthorsListSelector);

  // add html from allAuthors to authorList
  const allAuthorsData = {authors: []};

  for (let author in allAuthors) {
    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author]
    });
  }

  authorList.innerHTML = templates.authorLink(allAuthorsData);

  // Adding event listeners to author links
  addClickListenersToAuthors();
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

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );

  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* create a new variable allTags with an empty object */
  allTags = {};

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
      const linkHTMLData = {tag: tag};
      const linkHTML = templates.tagLink(linkHTMLData);

      /* add generated code to html variable */
      html += linkHTML;

      /* check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* add tag to allTags object */
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

  /* find list of tags in right column */
  tagList = document.querySelector(optTagsListSelector);

  // Calculate and log tags parameters
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  // Log each tag usage
  for (let tag in allTags) {
    console.log(tag + ' is used ' + allTags[tag] + ' times');
  }

  function calculateTagsParams(tags) {
    const params = {
      min: 999999,
      max: 0
    };

    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      }
      if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }

    return params;
  }

  /* add html from allTags to tagList */
  const allTagsData = {tags: []};

  for (let tag in allTags) {
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }

  tagList.innerHTML = templates.tagCloudLink(allTagsData);

  // Adding event listeners to tags after generating them
  addClickListenersToTags();
}

generateTitleLinks();
generateTags();
generateAuthors();
addClickListenersToAuthors();
