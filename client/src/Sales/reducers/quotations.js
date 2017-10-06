const skel = {
    shipment_types: [],
    quotation_models: [],
    quotation: {
        products: [],
        quotation_groups: [],
        selected_group: {}
    } 
}

function quotations (state = skel, action) {
  
    switch(action.type) {
        case 'QUOTATION_PRODUCTS_GROUP_SELECTED':
            // if group already exists, select it
            let selected_group = state.quotation_groups.find(x=>x.id == action.payload.data.quotation_group_id);

            // if not, concat new one to list and select it 
            if(!selected_group) {
            
                // this new group only contains a list of products
                return Object.assign({}, state, {
                    selected_group: Object.assign({}, action.payload.data)     
                });
            } else {
                // select group
                return Object.assign({}, state, {
                    selected_group: Object.assign({}, selected_group)     
                });
            }  
        case 'QUOTATION_IMPORT_EXPENDITURE_CALCULATION_SUCCESS':
            return Object.assign({}, state, {
                selected_group: Object.assign({}, state.selected_group, action.payload.data)            
            });
        case 'SHIPMENT_TYPE_LIST_SUCCESS':
            return Object.assign([], state, {
                shipment_types: action.payload.list
            });
        case 'QUOTATION_MODELS_LIST_SUCCESS':
            return Object.assign([], state, {
                quotation_models: action.payload.list
            });
        case 'UPDATE_QUOTATION': 
            return Object.assign({}, state, action.payload.data);
        case 'ADD_PRODUCT_TO_QUOTATION': 
            return Object.assign({}, state, {
                products: state.products.concat([Object.assign({}, action.payload.data)])
            });
        case 'UPDATE_QUOTATION_PRODUCT': 

            const updatedList = state.products.map(item => {
                console.log("product state + payload", item, action.payload.data);
                if(item.product.id === action.payload.data.id) {
                    console.log("** found", { ...item, ...action.payload.data });
                    return { ...item, ...action.payload.data }
                }
                return item;
            }); 

            return Object.assign({}, state, {
                products: updatedList
            });
        case 'REMOVE_PRODUCT_FROM_QUOTATION': 
            // removes product from quotation, this is not related to quotation group
            return Object.assign({}, state, {
                products: state.products.filter(x=>x.id !== parseInt(action.payload.id))
            });   
        case 'QUOTATION_GROUP_CREATED':
            return Object.assign({}, state, {
                quotation_groups: state.quotation_groups.concat([Object.assign({}, action.payload.data)])
            });
        case 'REMOVE_QUOTATION_GROUP':
            return Object.assign({}, state, {
                quotation_groups: state.quotation_groups.filter(x=>x.id !== parseInt(action.payload.id))
            }); 
        default:  
            return state
    }

}

export default quotations