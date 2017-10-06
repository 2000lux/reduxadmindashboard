import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import SalesForm from '../containers/base_form'
import { getSale, addSale, saveSale, saleUnselected, fetchContactMeans, fetchStatuses } from '../actions'
import { fetchEnterpriseList } from 'Enterprises/actions'
import { fetchEnterpriseContactList } from 'Contacts/actions'
import { fetchCurrencies } from 'Commons/actions/currencies'
import { fetchProductList } from 'Products/actions'
import withFlashMessages from 'FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from 'Commons/utils/dropdownlists'
import {
  setCurrencyRates
  ,getCurrencyRates
} from '../../Commons/reducers/currencies_rates/actions'

const mapStateToProps = (store, ownProps) => {

    let enterprises = store.enterprises.list || [];
    if (enterprises.length > 0) {
        enterprises = mapForDropdownList(enterprises, {label:'legal_name'});
    }

    let contacts = store.contacts.list || [];
    if (contacts.length > 0) {
        contacts = mapForDropdownList(contacts, {label:'fullname'});
    }

    let statuses = store.sales.statuses || [];
    if (statuses.length > 0) {
        statuses = mapForDropdownList(statuses, {extra:'code'});
    }

    let contactMeans = store.sales.contact_means || [];
    if (contactMeans.length > 0) {
        contactMeans = mapForDropdownList(contactMeans, {id:'value', label: 'label', value: 'value'});
    }

    let currencies = store.currencies || [];
    if(currencies.length > 0) {
        currencies = mapForDropdownList(currencies);
    }

    return {
        data: store.sales.selected || {},
        currencies_rates: store.currencies_rates,
        contactMeans,
        enterprises,
        contacts,
        statuses,
        currencies
    }
}

const mapDispatchToProps = dispatch => {

    return {
        getSale: (sale_id) => { return dispatch(getSale(sale_id)); },
        getEnterprises: (filters) => { return dispatch(fetchEnterpriseList(filters)); },
        getContacts: (enterprise_id) => { return dispatch(fetchEnterpriseContactList(enterprise_id)); },
        getContactMeans: () => { return dispatch(fetchContactMeans()); },
        getStatuses: () => { return dispatch(fetchStatuses()); },
        getProducts: () => { return dispatch(fetchProductList()); },
        getCurrencies: () => { return dispatch(fetchCurrencies()); },
        unselectSale: () => { dispatch(saleUnselected()) },
        onAddSale: (data) => { return dispatch(addSale(data)) },
        onSaveSale: (data) => { return dispatch(saveSale(data)) },
        getCurrencyRates: () => getCurrencyRates(dispatch)
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(SalesForm))
