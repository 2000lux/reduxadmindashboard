import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import PurchaseOrderForm from '../components/purchase_order/form'
import { fetchCurrencies } from 'Commons/actions/currencies'
import { fetchProductList } from 'Products/actions'
import withFlashMessages from 'FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from 'Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  
 
    let currencies = store.currencies || [];
    if(currencies.length > 0) { 
        currencies = mapForDropdownList(currencies);
    }  

    let contacts = store.contacts.list || [];
    if (contacts.length > 0) {
        contacts = mapForDropdownList(contacts, {label:'fullname'});
    }  

    return {
        data: store.sales.selected || {},
        currencies,
        contacts
    }
}

const mapDispatchToProps = dispatch => {
   
    return {
        getProducts: () => { return dispatch(fetchProductList()); },
        getCurrencies: () => { return dispatch(fetchCurrencies()); },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(PurchaseOrderForm))