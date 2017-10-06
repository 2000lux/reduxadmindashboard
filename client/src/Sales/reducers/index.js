import quotation from 'Sales/reducers/quotations'

const skel = {
    list: [],
    statuses: [],
    contact_means: [],
    selected: {
        quotation: {
            products: [],
            quotation_groups: [],
            selected_group: {}
        }
    }    
}

function sales (state = skel, action) {
 
    // delegate to quotation reducer
    if( action.type.indexOf('QUOTATION') !== -1
        || action.type.indexOf('SHIPMENT') !== -1) {
        return {
            ...state,
            selected: {
                quotation: quotation(state.selected.quotation, action)
            }
        }        
    }

    switch (action.type) {  
        case 'SALE_LIST_SUCCESS':   
            return Object.assign({}, state, {
                list: action.payload.list
            });  
        case 'SALE_SELECTED':
            return Object.assign({}, state, {
                selected: action.payload.data
            }); 
        case 'SALE_UNSELECTED':
            return Object.assign({}, state, {
                selected: undefined
            });
        case 'ADD_SALE':
            return Object.assign({}, state, {
                list: state.list.concat([action.payload.data])
            });
        case 'SALE_STATUSES_LIST_SUCCESS':
            return Object.assign({}, state, {
                statuses: action.payload.data
            });   
        case 'CONTACT_MEANS_LIST_SUCCESS':
            return Object.assign({}, state, {
                contact_means: action.payload.data
            });   
        case 'SAVE_SALE':
            // replace item 
            const updatedList = state.list.map(item => {

                if(item.id === action.payload.data.id){
                    return { ...item, ...action.payload.data }
                }
                return item
            })
           
            return Object.assign({}, state, {
                list: updatedList
            });        
        case 'REMOVE_SALE':
            return Object.assign({}, state, {
                list: state.filter( (sale) => { return sale.id !== action.payload.id } )
            });                 
        default:
            return state
    }
}

export default sales 
