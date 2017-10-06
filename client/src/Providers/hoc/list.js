import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProvidersList from '../components'
import { fetchProviderList, providerListSuccess, addProvider, saveProvider, removeProvider } from '../actions'
import { fetchCountryList } from '../../Commons/actions/countries'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

const mapStateToProps = (store, ownProps) => {  

    let countries = [];
    if(store.countries.list) {
        countries = Object.values(store.countries.list).map((country)=>{
            return {
                id: country.id,
                label: country.name,
                value: country.code
            }
        });
    } 

    return {
        countries,
        providers: store.providers.list || []
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchCountryList: () => { return dispatch(fetchCountryList()); },
        fetchProviderList: (filters) => { return dispatch(fetchProviderList(filters, true)); },
        onAddProvider: (data) => { return dispatch(addProvider(data)) },
        onSaveProvider: (data) => { return dispatch(saveProvider(data)) },
        onRemoveProvider: (id) => { return dispatch(removeProvider(id)) },
        onProviderListSuccess: (list) => { dispatch(providerListSuccess(list)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ProvidersList))