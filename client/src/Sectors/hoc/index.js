import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SectorsPage from '../components'
import { fetchSectorList, sectorListSuccess, addSector, saveSector, removeSector } from '../actions'
import { getEnterprise } from '../../Enterprises/actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

const mapStateToProps = (store, ownProps) => {  
    return {
        sectors: store.sectors.list || [],
        enterprise: store.enterprises.selected || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchSectorList: (enterprise_id) => { return dispatch(fetchSectorList(enterprise_id)); },
        getEnterprise: (enterprise_id) => { return dispatch(getEnterprise(enterprise_id)) },
        onAddSector: (enterprise_id, data) => { return dispatch(addSector(enterprise_id, data)) },
        onSaveSector: (enterprise_id, data) => { return dispatch(saveSector(enterprise_id, data)) },
        onRemoveSector: (enterprise_id, sector_id) => { return dispatch(removeSector(enterprise_id, sector_id)) },
        onSectorListSuccess: (sectors) => { dispatch(sectorListSuccess(sectors)) }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(SectorsPage))

