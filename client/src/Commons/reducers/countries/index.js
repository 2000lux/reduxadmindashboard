const skel = {
    list: [],
    provinces: []
};

function countries (state = skel, action) {

    switch (action.type) {  
        case 'COUNTRY_LIST_SUCCESS':   
            return Object.assign([], state, {
                list: action.payload.list
            });  
        case 'PROVINCE_LIST_SUCCESS':   
            return Object.assign([], state, {
                provinces: action.payload.list
            });                 
        default:
            return state
    }
}

export default countries 
