import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => { elements.searchInput.value = ''; };

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });

    /** Check if recipe to highlight is in the searchlist - Solution provided by nother student */
    const inList = resultsArr.includes(el => {
        el.getAttribute('href') === `${id}`;// Removed # for uniformity. Original was -- el.getAttribute('href') === `#${id}`;
    });

    if (inList)
        document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

/*
// 'Pasta with tomatoes and spinach'
acc: 0 / acc + cur.length = 5 / newTitle = ['Pasta']
acc: 5 / acc + cur.length = 9 / newTitle = ['Pasta','with']
acc: 9 / acc + cur.length = 15 / newTitle = ['Pasta','with', 'tomato']
acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta','with', 'tomato']
acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta','with', 'tomato']
*/

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

/*
// Simple approach as suggested by other student
const limitRecipeTitle = (title, limit = 17) => {
    if (title.length > limit) return title.slice(0, limit) + '...';
    return title;
}
*/

const renderRecipe = recipe => {
    const markup = `
<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// Type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Only Button to go to next page
        button = createButton(page, 'next');
    } else if (pages < pages) {
        // Both prev and next button
        button = `
    ${createButton(page, 'prev')}
    ${createButton(page, 'next')}
    `;
    } else if (pages === pages && pages > 1) {
        // Only Button to go to previous page
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    // Render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};