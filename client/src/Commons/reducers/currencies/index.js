function currencies (state = [], action) {

    switch (action.type) {
        case 'CURRENCY_LIST_SUCCESS':
            return action.payload.list; 
        default:
            return state
    }
}

export default currencies
