import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import config from 'Config/app.js'
import ReactQuill from 'react-quill'
import DayPickerInput from 'react-day-picker/DayPickerInput'
import LocaleUtils from 'react-day-picker/moment'
import moment from 'moment'
import 'moment/locale/es'
import ProductQuotationForm from './form.quotation.products.form'
import ProductsTable from './form.quotation.products.table'
import CalculatorModal from './form.quotation.products.modal'
import { formatChildfield } from 'Commons/utils/formatters'
import { 
    handleInputChange, handleOptionChange, handleDateChange } from 'Commons/utils/forms'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import swal from 'sweetalert2'
import Actions from './form.quotation.tableActions'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        product_types: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        shipment_types: PropTypes.array.isRequired,
        getCurrencies: PropTypes.func.isRequired,
        getShipmentTypesList: PropTypes.func.isRequired,
        addProduct: PropTypes.func.isRequired,
        saveProduct: PropTypes.func.isRequired,
        removeProduct: PropTypes.func.isRequired,
        updateQuotation: PropTypes.func.isRequired
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: {
            number: undefined,
            date: undefined,            
            currency: {},
            total_price: undefined,
            products: []
        }, 
        form: {
            quantity: "",
            fob_price: "",
            sale_price: "",
            export_expenditure: "",
            currency: {},
            product: {},
            isEdition: false
        }
    }
  
    constructor(props) {

        super(props);

        this.handleDateChange = handleDateChange.bind(this);
        this.handleInputChange = handleInputChange.bind(this);
        this.handleOptionChange = handleOptionChange.bind(this);
        this.handleProductChange = this.handleProductChange.bind(this);
        this.onAddProduct = this.onAddProduct.bind(this);
        this.onEditProduct = this.onEditProduct.bind(this);
        this.onSaveProduct = this.onSaveProduct.bind(this);
        this.onDeleteProduct = this.onDeleteProduct.bind(this);
        this.calculatePrice = this.calculatePrice.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.reset = this.reset.bind(this);
        
        this.state = {
            data: {
                ...Form.defaultProps.data,
                ...props.data,
            },
            modal: {
                rows: [],
                isOpen: false
            }
        }
    } 
    
    openModal() {
        this.setState({
            modal: Object.assign({}, this.state.modal, {
                isOpen: true
            })
        });
    };
    
    hideModal() {
        this.setState({
            modal: Object.assign({}, this.state.modal, {
                isOpen: false
            })
        });
    };

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;
                    
        this.props.getCurrencies()
        .then(()=> {
            return this.props.getShipmentTypesList();
        })
        .then(()=> {
            return this.props.getProducts();
        })
        .then(()=> {
            // convert plain data to object (in order to be able to edit them in corresponding form) 
            if(this.state.data.products && this.state.data.products.length > 0) {
                const prods = this.state.data.products.map(x=>{
                    return {
                        ...x,
                        product: _.find(self.props.products, {id: x.product_id}),
                        type: _.find(self.props.product_types, {id: x.type}),
                        currency: _.find(self.props.currencies, {id: x.currency_id})
                    }
                });
          
                this.props.updateQuotation({
                    products: prods
                });
            }
        }); // list of products for dropdownlist           
    }

    componentWillReceiveProps(newProps) {
   
        const date = newProps.data.date 
                ? moment(newProps.data.date, config.dates.visual_format) 
                : moment().format();
  
        this.setState({
            data: {
                ...newProps.data,
                ...this.state.data,
                products: newProps.data.products,
                date
            }
        });
    }

    componentWillUpdate(nextProps, nextState) {

        // parent form collects children data
        const data = nextState.data;
        this.props.formChanged('quotation', {
            id: this.props.data.id,
            number: data.number,
            date: data.date,
            currency: data.currency,
            total_price: data.total_price,
            products: data.products
        });
    }

    handleProductChange(data) { 
        this.setState({
            form: Object.assign({}, this.state.form, data)
        })   
    }

    onAddProduct(data) {
        this.props.addProduct(data);
        this.reset();
    }

    onEditProduct(id) {
     
        const data = _.find(this.state.data.products, {product: {id: parseInt(id)}});
        data.isEdition = true;
        this.setState({
            form: data
        });
    }

    onSaveProduct(data) {
        this.props.saveProduct(data);
        this.reset();
    }

    onDeleteProduct(id) {

        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el producto del listado",
        }).then(function () {
            self.props.removeProduct(id)
                .then(_=>{
                    self.props.flashSuccess({
                        text: "Se ha eliminado el producto"
                    });
            }).catch(err=>{
                self.props.flashError({
                    text: "Hubo un error al eliminar el producto"
                })
            }); 
        }, _=>{})  
    }

    calculatePrice(rows) {

        this.setState({
            modal: Object.assign({}, this.state.modal, {
                rows
            })
        }, _=> this.openModal());        
    }

    reset() {
        this.setState({
            form: Form.defaultProps.form
        });
    }

    render() {

        const data = this.state.data;

        const dayPickerProps = config.dates.dayPickerProps;

        return (

            <div className="portlet light bordered">

                <div className="portlet-title">
                    <div className="row">

                        <div className="col-xs-12 col-sm-6">
                            <div className="caption font-green-sharp">
                                <i className="fa fa-circles font-red-sunglo"></i>
                                <span className="caption-subject bold uppercase">                                    
                                   Cotización</span>
                            </div>     
                        </div>
                    </div>
                </div>
                <div className="portlet-body form">

                    <div className="form-body">

                        <div className="row">

                            <div className="col-xs-12 col-md-2">
                                <div className="form-group">
                                    <label htmlFor="number">Número</label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            name="number"     
                                            className="form-control"
                                            placeholder="Número"
                                            value={data.number}
                                            onChange={this.handleInputChange}
                                            />
                                        <span className="input-group-addon">
                                            <span className="icon-tag"></span>
                                        </span>
                                    </div>
                                </div>             
                            </div>

                            <div className="col-sm-12 col-md-2 col-lg-2">
                                <label>Fecha</label>
                                <div className="form-group date-small">
                                    
                                    <DayPickerInput
                                        name="date"                                            
                                        placeholder="dd/mm/yyyy"
                                        format={config.dates.visual_format}
                                        value={moment(data.date).format(config.dates.visual_format)}
                                        onDayChange={this.handleDateChange}
                                        dayPickerProps={dayPickerProps}
                                        />
                                </div>
                            </div>                 
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <ProductQuotationForm 
                                    data={this.state.form}
                                    product_types={this.props.product_types}
                                    products={this.props.products} 
                                    currencies={this.props.currencies} 
                                    onCancel={ this.reset }
                                    onAddProduct={this.onAddProduct}
                                    onSaveProduct={this.onSaveProduct}
                                    handleInputChange={this.handleInputChange}
                                    handleOptionChange={this.handleOptionChange}
                                    handleProductChange={this.handleProductChange}
                                />                                
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <ProductsTable 
                                    products={ data.products } 
                                    onEditProduct={ this.onEditProduct }
                                    onDeleteProduct={ this.onDeleteProduct }
                                    calculatePrice={ this.calculatePrice }
                                    />                               
                            </div>                 
                        </div>
                        
                        <CalculatorModal rows={ this.state.modal.rows } 
                            shipment_types= { this.props.shipment_types }
                            isOpen={ this.state.modal.isOpen } 
                            hideModal={ this.hideModal } />

                        <hr />

                        <div className="row">
                            <div className="col-sm-12">
                                    <div className="col-xs-4 col-md-2">
                                        <div className="form-group">
                                            <label>Moneda</label>
                                            { this.props.currencies.length > 0 && data.currency &&    
                                                <Select
                                                    name="currency"
                                                    clearable={false}
                                                    placeholder="Seleccione..."
                                                    value={data.currency.id}
                                                    options={this.props.currencies}
                                                    onChange={obj=>{this.handleOptionChange("currency", obj)}}
                                                    />
                                            }
                                        </div>         
                                    </div>

                                    <div className="col-xs-8 col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="total_price">Monto Total</label>
                                            <div className="input-group">
                                                <input
                                                    type="text"
                                                    name="total_price"     
                                                    className="form-control"
                                                    placeholder="Monto Total"
                                                    value={data.total_price}
                                                    onChange={this.handleInputChange}
                                                    />
                                                <span className="input-group-addon">
                                                    <span className="fa fa-usd"></span>
                                                </span>
                                            </div>
                                        </div>             
                                    </div>
                            </div>
                        </div>

                        <input type="hidden" name="id" value={this.props.data.id} />                         
                    </div>
                </div>
            </div>
        );
    }
}

export default Form