function clean(params) {
    const cleanBtn = document.querySelector('.clean-btn'),
        searchResult = document.querySelector('.search__result'),
        searchQuery = document.querySelector('.search-query');

    cleanBtn.addEventListener('click', () => {
        searchQuery.value = '';
        searchResult.innerHTML = '';
    });
}

export default clean;