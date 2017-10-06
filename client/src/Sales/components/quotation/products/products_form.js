import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import FlashMessages from 'FlashMessages'
import config from 'Config/app.js'

class Form extends Component {

    render() {

        const data = this.props.data;
        const products = this.props.products;

        return (

            <div className="quotation-group-product-form">
                <div className="portlet light bg-inverse">
                    <div className="portlet-body">

                        <div className="form-body">

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="row">

                                        <div className="col-xs-12 col-sm-4 col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="quantity">Cantidad</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        name="quantity"     
                                                        className="form-control"
                                                        placeholder="Cantidad"
                                                        value={data.quantity}
                                                        onChange={e=>this.props.handleInputChange(e, 'product_form')}
                                                        />
                                                </div>
                                            </div>             
                                        </div>        

                                        <div className="col-xs-12 col-sm-4 col-md-3">
                                            <div className="form-group">
                                                <label>Tipo</label>
                                                <Select
                                                    name="type"
                                                    clearable={false}
                                                    placeholder="Seleccione..."
                                                    value={data.type.value}
                                                    options={this.props.product_types}
                                                    onChange={obj=>{this.props.handleOptionChange("type", obj, 'product_form')}}
                                                    />
                                            </div>
                                        </div>

                                        <div className="col-sm-12 col-md-12 col-lg-7">
                                            <div className="form-group">
                                                <label>Producto</label>
                                                { products.length > 0 && data.product &&
                                                    <Select
                                                        name="product"
                                                        placeholder="Seleccione..."
                                                        value={data.product.id}
                                                        options={products}
                                                        clearable={false}
                                                        onChange={obj=>{this.props.handleProductChange(obj)}}
                                                        />
                                                }  
                                            </div>
                                        </div>
                                    </div>                                  
                                </div>    

                                <div className="col-md-12">            
                                    <div className="row">
                                              
                                        <div className="col-xs-12 col-sm-4  col-md-2">
                                            <div className="form-group">
                                                <label>Moneda</label>
                                                { this.props.currencies.length > 0 && data.currency &&    
                                                    <Select
                                                        name="currency"
                                                        clearable={false}
                                                        placeholder="Seleccione..."
                                                        value={data.currency.id}
                                                        options={this.props.currencies}
                                                        onChange={obj=>{this.props.handleOptionChange("currency", obj, 'product_form')}}
                                                        />
                                                }
                                            </div>         
                                        </div>

                                        <div className="col-xs-12 col-sm-4  col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="fob_price">FOB</label>
                                                <div className="input-group">
                                                    <input
                                                        type="text"
                                                        name="fob_price"     
                                                        className="form-control"
                                                        placeholder="FOB"
                                                        value={data.fob_price}
                                                        onChange={e=>this.props.handleInputChange(e, 'product_form')}
                                                        /> 
                                                    <span className="input-group-addon">
                                                        <span className="fa fa-usd"></span>
                                                    </span>
                                                </div>
                                            </div>             
                                        </div>

                                        <div className="col-xs-0 col-sm-0 col-md-4"></div>

                                        <div className="col-xs-12 col-sm-4 col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="fob_price">&nbsp;</label>
                                                <div>
                                                { !data.isEdition &&
                                                    <button className="btn btn-info pull-right" 
                                                        type="button"
                                                        onClick={_=>this.props.onAddProduct()}>
                                                        <i className="fa fa-plus"></i> Agregar Producto</button>
                                                }

                                                { data.isEdition &&
                                                    <div className="row">    
                                                        <div className="col-xs-12">
                                                            <button className="btn btn-info btn-save-product pull-right" 
                                                                type="button"
                                                                onClick={_=>this.props.onSaveProduct()}>
                                                                <i className="fa fa-pencil"></i> Actualizar</button>

                                                            <button className="btn btn-info pull-right" 
                                                                type="button"
                                                                onClick={_=>this.props.onCancel()}>
                                                                Cancelar</button>
                                                        </div>
                                                    </div>
                                                }
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form