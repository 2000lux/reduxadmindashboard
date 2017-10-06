import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import FlashMessages from 'FlashMessages'
import config from 'Config/app.js'
import View from 'Sales/components/quotation/products/products_form'

class Form extends Component {

    static PropTypes = {
        data: PropTypes.object,
        products: PropTypes.array.isRequired,
        onAddProduct: PropTypes.func.isRequired,
        onSaveProduct: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        handleInputChange: PropTypes.func.isRequired,
        handleOptionChange: PropTypes.func.isRequired,
        handleProductChange: PropTypes.func.isRequired,
        isEdition: PropTypes.bool
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: { 
            type: {},
            product: {},
            currency: {}
        },
        products: [],
        filtered_products: [] // same as before but filtered by type
    }

    constructor(props) {

        super(props);        
        this.state = {
            ...Form.defaultProps
        }

        this.handleProductChange = this.handleProductChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
      
        const update = {}

        update.data = Object.assign(Form.defaultProps.data, this.state.data, newProps.data);

        /**
         * Init products list state
         */
        if(this.state.products.length == 0) {
            update.products = newProps.products;
            update.filtered_products = newProps.products;
        }
       
        /**
         * Filter products based on type
         */
        if(newProps.data.type !== this.state.data.product.type) {
            
            if(newProps.data.type == undefined) {
                // unfiltered list
                update.filtered_products = newProps.products;
            } else {
                // filtered products list
                update.filtered_products = newProps.products.filter(x=>{
                    return x.type == newProps.data.type.value;
                });
            }
        }

        this.setState(update);
    }

    /**
     * Cascade behavior
     * @param {*} obj 
     */
    handleProductChange(obj) { 
        this.props.handleProductChange({
            product: obj,
            currency: this.props.currencies.find(x=>x.id == obj.currency.id),
            fob_price: obj.price
        })      
    } 

    render() {

        return (

            <View 
                data={this.state.data}
                product_types={this.props.product_types}
                products={this.state.filtered_products}
                currencies={this.props.currencies}
                handleInputChange={this.props.handleInputChange} 
                handleOptionChange={this.props.handleOptionChange} 
                handleProductChange={this.handleProductChange} 
                onAddProduct={_=>this.props.onAddProduct(this.state.data)} 
                onSaveProduct={_=>this.props.onSaveProduct(this.state.data)} 
                onCancel={this.props.onCancel} 
            />
        );
    }
}

export default Form