import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductsList from '../components'
import { fetchProductList, productListSuccess, productUnselected, addProduct, saveProduct, removeProduct } from '../actions'
import withFlashMessages from '../../FlashMessages/hoc/with-flash-messages'

const mapStateToProps = (store, ownProps) => {  
    return {
        products: store.products.list || []
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchProductList: () => { return dispatch(fetchProductList()); },
        onAddProduct: (data) => { dispatch(addProduct(data)) },
        onSaveProduct: (data) => { dispatch(saveProduct(data)) },
        onRemoveProduct: (id) => { dispatch(removeProduct(id)) },
        onProductListSuccess: (list) => { dispatch(productListSuccess(list)) },
        unselectProduct: (data) => { dispatch(productUnselected(data)) },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(ProductsList))