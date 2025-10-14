
const search = (searchQuery, searchList) => {
    if(searchQuery.trim() === ''){
        return searchList;
    }
    else{
        const filtered = searchList.filter((item) => (
            // to convert it into string I have used backticks
            `${item.firstName} ${item.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ))
        return filtered
    }
}

export default search;