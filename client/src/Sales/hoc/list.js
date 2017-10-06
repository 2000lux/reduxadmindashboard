import React, {Component} from 'react';
import { connect } from 'react-redux'
import withFlashMessages from 'FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from 'Commons/utils/dropdownlists'
import SalesList from 'Sales/components/list'
import { fetchEnterpriseList } from 'Enterprises/actions'
import { fetchContactsList } from 'Contacts/actions'
import { fetchSalesList, saleListSuccess, fetchStatuses, removeSale } from 'Sales/actions'

const mapStateToProps = (store, ownProps) => {  
    
    let enterprises = store.enterprises.list || [];
    if (enterprises.length > 0) {
        enterprises = mapForDropdownList(enterprises, {label:'legal_name'});
    }  

    let statuses = store.sales.statuses || [];
    if (statuses.length > 0) {
        statuses = mapForDropdownList(statuses, {value:'id'});
    }  

    return {
        sales: store.sales.list || [],
        enterprises,
        statuses,
    }
}

const mapDispatchToProps = dispatch => { 
    return {
        fetchSalesList: (filters) => { return dispatch(fetchSalesList(filters)); },
        fetchEnterpriseList: () => { return dispatch(fetchEnterpriseList()); },
        fetchStatuses: () => { return dispatch(fetchStatuses()); },
        onRemoveSale: (id) => { return dispatch(removeSale(id)) },
        onSaleListSuccess: (list) => { dispatch(saleListSuccess(list)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(SalesList))