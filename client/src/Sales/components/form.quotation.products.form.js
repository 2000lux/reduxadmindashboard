import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import FlashMessages from 'FlashMessages'
import config from 'Config/app.js'
import ReactQuill from 'react-quill'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
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
        }
    }

    constructor(props) {

        super(props);        
        this.state = Form.defaultProps;

        this.handleProductChange = this.handleProductChange.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const data = Object.assign(Form.defaultProps.data, newProps.data);
        this.setState({
            data
        });
    }

    handleProductChange(obj) {
        this.props.handleProductChange({
            product: obj,
            currency: obj.currency,
            fob_price: obj.price
        })      
    } 

    render() {

        const data = this.state.data;

        return (

            <div>
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
                                                        onChange={e=>this.props.handleInputChange(e, 'form')}
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
                                                    onChange={obj=>{this.props.handleOptionChange("type", obj, 'form')}}
                                                    />
                                            </div>
                                        </div>

                                        <div className="col-sm-12 col-md-12 col-lg-7">
                                            <div className="form-group">
                                                <label>Producto</label>
                                                { this.props.products.length > 0 && data.product &&
                                                    <Select
                                                        name="product"
                                                        placeholder="Seleccione..."
                                                        value={data.product.id}
                                                        options={this.props.products}
                                                        clearable={false}
                                                        onChange={obj=>{this.handleProductChange(obj)}}
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
                                                        onChange={obj=>{this.props.handleOptionChange("currency", obj, 'form')}}
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
                                                        onChange={e=>this.props.handleInputChange(e, 'form')}
                                                        />
                                                    <span className="input-group-addon">
                                                        <span className="fa fa-usd"></span>
                                                    </span>
                                                </div>
                                            </div>             
                                        </div>

                                        <div className="col-xs-0 col-sm-0 col-md-4"></div>

                                        <div className="col-xs-12 col-sm-4 col-md-3">
                                            <div className="form-group text-right">
                                                { !data.isEdition &&
                                                    <button className="btn btn-info" 
                                                        type="button"
                                                        onClick={_=>this.props.onAddProduct(this.state.data)}>
                                                        <i className="fa fa-plus"></i> Agregar Producto</button>
                                                }

                                                { data.isEdition &&
                                                    <div className="row">    
                                                        <div className="col-xs-6">
                                                            <button className="btn btn-info" 
                                                                type="button"
                                                                onClick={_=>this.props.onCancel()}>
                                                                Cancelar</button>
                                                        </div>

                                                        <div className="col-xs-6">
                                                            <button className="btn btn-info" 
                                                                type="button"
                                                                onClick={_=>this.props.onSaveProduct(this.state.data)}>
                                                                <i className="fa fa-pencil"></i> Actualizar</button>
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
        );
    }
}

export default Form