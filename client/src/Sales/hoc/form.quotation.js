import React, {Component} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import QuotationForm from 'Sales/containers/quotation/quotation_form'
import { fetchCurrencies } from 'Commons/actions/currencies'
import { fetchProductList } from 'Products/actions'
import { updateQuotation, 
    fetchShipmentTypesList, 
    calculateImportExpenditure,
    selectQuotationProductsGroup, 
    addProduct, 
    saveProduct, 
    removeProduct,
    fetchQuotationModels,
    createQuotationGroup,
    saveQuotationGroup,
    removeQuotationGroup } from 'Sales/actions/quotations'
import withFlashMessages from 'FlashMessages/hoc/with-flash-messages'
import { mapForDropdownList } from 'Commons/utils/dropdownlists'

const mapStateToProps = (store, ownProps) => {  
   
    const product_types = [
        {id: 'producto', value: 'producto', label: 'Producto'},
        {id: 'repuesto', value: 'repuesto', label: 'Repuesto'}
    ]

    let products = store.products.list || [];
    if (products.length > 0) {
        products = mapForDropdownList(products, {
            extra: ['currency', 'price', 'type']
        });
    }  

    let currencies = store.currencies || [];
    if(currencies.length > 0) { 
        currencies = mapForDropdownList(currencies);
    }  

    let shipment_types = store.sales.selected.quotation.shipment_types || [];
    if(shipment_types.length > 0) { 
        shipment_types = mapForDropdownList(shipment_types, {value: 'keyname'});
    }  

    return {
        sale_id: ownProps.sale_id,
        data: ownProps.data, // instead of looking in the store, this hoc receives data from main hoc (form.js)
        shipment_types,
        product_types,
        products,
        currencies
    }
}

const mapDispatchToProps = dispatch => {
   
    return {
        getProducts: () => { return dispatch(fetchProductList()); },
        getCurrencies: () => { return dispatch(fetchCurrencies()); },
        getShipmentTypesList: () => { return dispatch(fetchShipmentTypesList()); },
        getQuotationModels: () => { return dispatch(fetchQuotationModels()); },
        calculateImportExpenditure: (data) => { return dispatch(calculateImportExpenditure(data)); },
        updateQuotation: (data) => { return dispatch(updateQuotation(data)); },
        selectQuotationProductsGroup: (data) => { return dispatch(selectQuotationProductsGroup(data)); },
        addProduct: (data) => { return dispatch(addProduct(data)); },
        saveProduct: (data) => { return dispatch(saveProduct(data)); },
        removeProduct: (id) => { return dispatch(removeProduct(id)); },
        createQuotationGroup: (data) => { return dispatch(createQuotationGroup(data)); },
        saveQuotationGroup: (id) => { return dispatch(saveQuotationGroup(id)); },
        removeQuotationGroup: (id) => { return dispatch(removeQuotationGroup(id)); }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withFlashMessages(QuotationForm))