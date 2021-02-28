import renderResult from "./renderResult";

function getItems(params) {

    const searchQuery = document.querySelector('.search-query'),
        searchBtn = document.querySelector('.search-btn'),
        resultCounter = document.querySelector('.search__counter');


    const url =
        'https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json';

    const universities = [];
    let result = [];

    searchBtn.addEventListener('click', () => {
        resultCounter.innerHTML = 'Pleas wait a moment...';
        async function getResource(url) {
            let res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Could not fetch ${url}, status: ${res.status}`);
            }
            return await res.json();
        }

        getResource(url)
            .then((e) => {
                universities.push(...e);
            })
            .then(() => {
                result = universities.filter(e => {
                    return e.country.toLowerCase() == searchQuery.value.toLowerCase();
                });
            })
            .then(() => {
                renderResult(result);
            });
    });
}

export default getItems;