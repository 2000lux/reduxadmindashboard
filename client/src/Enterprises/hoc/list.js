import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import EnterprisesList from '../components'
import { fetchEnterpriseList, enterpriseListSuccess, addEnterprise, saveEnterprise, removeEnterprise } from '../actions'
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
        enterprises: store.enterprises.list || []
    }
}

const mapDispatchToProps = dispatch => { 
    return {
        fetchCountryList: () => { return dispatch(fetchCountryList()); },
        fetchEnterpriseList: (filters) => { return dispatch(fetchEnterpriseList(filters)); },
        onAddEnterprise: (data) => { return dispatch(addEnterprise(data)) },
        onSaveEnterprise: (data) => { return dispatch(saveEnterprise(data)) },
        onRemoveEnterprise: (id) => { return dispatch(removeEnterprise(id)) },
        onEnterpriseListSuccess: (list) => { dispatch(enterpriseListSuccess(list)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(EnterprisesList))