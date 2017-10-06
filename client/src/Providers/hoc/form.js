import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProvidersForm from '../components/form'
import { addProvider, saveProvider, getProvider, providerUnselected } from '../actions'
import { fetchCountryList, fetchProvinceList } from '../../Commons/actions/countries'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from '../../Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  

     // fetch countries and format data for dropdownlist
    let countries = store.countries.list;
    if (countries.length) {
        countries = mapForDropdownList(countries);
    } 

    let provinces = store.countries.provinces;
    if (provinces.length) {
        provinces = mapForDropdownList(provinces);
    } 

    return {
        data: store.providers.selected,
        countries,
        provinces
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getProvider: (id) => { return dispatch(getProvider(id)); },
        getCountries: () => { return dispatch(fetchCountryList()); },
        getProvinces: (country_id) => { return dispatch(fetchProvinceList(country_id)); },
        unselectProvider: () => { dispatch(providerUnselected()) },
        onAddProvider: (data) => { return dispatch(addProvider(data)) },
        onSaveProvider: (data) => { return dispatch(saveProvider(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ProvidersForm))