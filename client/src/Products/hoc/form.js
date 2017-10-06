import React, {Component} from 'react'
import { connect } from 'react-redux'
import ProductForm from '../components/form'
import { getProduct, addProduct, saveProduct, productUnselected } from '../actions'
import { fetchProviderList } from '../../Providers/actions'
import { fetchFamilyList } from '../../Commons/actions/families'
import { fetchGroupList } from '../../Commons/actions/groups'
import { fetchCurrencies } from '../../Commons/actions/currencies'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'
import _ from 'lodash'

const mapStateToProps = (store, ownProps) => {  
    
    const types = [
        {id: 'producto', value: 'producto', label: 'Producto'},
        {id: 'repuesto', value: 'repuesto', label: 'Repuesto'}
    ]

    // fetch providers and format data for dropdownlist
    let providers = store.providers.list;
    if (providers.length > 0) {
        providers = mapForDropdownList(providers, {label: 'legal_name'});
    }  

    // fetch families and format data for dropdownlist
    let families = store.families.list;
    if(families.length > 0) { 
        families = mapForDropdownList(families);
    }    
  
    // fetch groups and format data for dropdownlist
    let groups = store.families.groups;
    if(groups.length > 0) { 
        groups = mapForDropdownList(groups);
    }    

    // fetch groups and format data for dropdownlist
    let currencies = store.currencies;
    if(currencies.length > 0) { 
        currencies = mapForDropdownList(currencies);
    }    
 
    return {
        data: store.products.selected,
        types,
        providers,
        families,
        groups,
        currencies
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getProduct: (id) => { return dispatch(getProduct(id)); },
        getProviders: () => { return dispatch(fetchProviderList()); },
        getFamilies: () => { return dispatch(fetchFamilyList()); },
        getGroups: (family_id) => { return dispatch(fetchGroupList(family_id)); },
        getCurrencies: () => { return dispatch(fetchCurrencies()); },
        familySelected: (family) => { return dispatch(familySelected(family)); },
        unselectProduct: () => { return dispatch(productUnselected()) },
        onAddProduct: (data) => { return dispatch(addProduct(data)) },
        onSaveProduct: (data) => { return dispatch(saveProduct(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ProductForm))