function renderResult(result) {
    const searchResult = document.querySelector('.search__result'),
        resultCounter = document.querySelector('.search__counter');

    searchResult.innerHTML = '';

    for (let i = 0; i < result.length / 5; i++) {
        let item = `
            <li class="search__box">
                ${i+1}. ${result[i].name} <a href="${result[i].web_pages}">${result[i].web_pages}</a> 
            </li>
        `;
        searchResult.innerHTML += item;
        resultCounter.innerHTML = `Всього результатів: ${i+1}`;
    }
}

export default renderResult;