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
import ProductQuotationForm from 'Sales/components/quotation/products/products_form'
import ProductsTable from 'Sales/components/quotation/products/table'
import QuotationGroupsTable from 'Sales/components/quotation/groups/table'
import View from 'Sales/components/quotation/quotation_form'
import { formatChildfield } from 'Commons/utils/formatters'
import { 
    handleInputChange, handleOptionChange, handleDateChange } from 'Commons/utils/forms'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import swal from 'sweetalert2'

class QuotationForm extends Component {

    static propTypes = {
        data: PropTypes.object,
        quoted: PropTypes.bool.isRequired,
        product_types: PropTypes.array.isRequired,
        products: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        shipment_types: PropTypes.array.isRequired,
        getCurrencies: PropTypes.func.isRequired,
        getShipmentTypesList: PropTypes.func.isRequired,
        getQuotationModels: PropTypes.func.isRequired,
        calculateImportExpenditure: PropTypes.func.isRequired,
        selectQuotationProductsGroup: PropTypes.func.isRequired,
        addProduct: PropTypes.func.isRequired,
        saveProduct: PropTypes.func.isRequired,
        removeProduct: PropTypes.func.isRequired,
        createQuotationGroup: PropTypes.func.isRequired,
        saveQuotationGroup: PropTypes.func.isRequired,
        removeQuotationGroup: PropTypes.func.isRequired,
        updateQuotation: PropTypes.func.isRequired
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        // quotation data
        data: {
            number: undefined,
            date: undefined,            
            currency: {},
            total_price: undefined,
            products: [],
            quotation_groups: [],
            selected_group: undefined
        }, 
        // products form
        product_form: {
            quantity: "",
            fob_price: "",
            sale_price: "",
            import_expenditure: "",
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
        this.onSaveQuotationGroup = this.onSaveQuotationGroup.bind(this);
        this.onDeleteQuotationGroup = this.onDeleteQuotationGroup.bind(this);
        this.onOpenQuotationModal = this.onOpenQuotationModal.bind(this);
        this.onGenerateDocumentClicked = this.onGenerateDocumentClicked.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.reset = this.reset.bind(this);
        
        this.state = {
            data: {
                ...QuotationForm.defaultProps.data,
                ...props.data,
            },
            product_form: {

            },
            modals: {
                quotation_group: {
                    isOpen: false
                },
                models: {
                    isOpen: false
                }
            }
        }
    }     

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
                const products = this.state.data.products.map(x=>{
                    return {
                        ...x,
                        product: _.find(self.props.products, {id: x.product_id}),
                        type: _.find(self.props.product_types, {id: x.type}),
                        currency: _.find(self.props.currencies, {id: x.currency_id})
                    }
                });

                // convert currency to object
                let quotation_groups = [];
                if(this.state.data.quotation_groups && this.state.data.quotation_groups.length > 0) {
                    quotation_groups = this.state.data.quotation_groups.map(x=>{
                        return {
                            ...x,
                            currency: _.find(self.props.currencies, {id: x.currency_id})
                        }
                    });
                }
          
                // basically updates store with improved data structure
                this.props.updateQuotation({
                    products,
                    quotation_groups
                });
            }
        }); // list of products for dropdownlist           
    }

    componentWillReceiveProps(newProps) {

        const date = newProps.data.date 
                ? moment(newProps.data.date, config.dates.visual_format) 
                : moment().format();
      
        let newState = {
            data: {
                ...newProps.data,
                ...this.state.data,
                selected_group: newProps.data.selected_group, // data for modal
                products: newProps.data.products, // products table
                quotation_groups: newProps.data.quotation_groups, // quotation groups table
                date
            }
        };

        this.setState(newState);
    }

    componentWillUpdate(nextProps, nextState) {

        // parent form collects children data
        const data = nextState.data;
    }

    handleProductChange(data) { 
        this.setState({
            product_form: Object.assign({}, this.state.product_form, data)
        })   
    }

    onAddProduct(data) {
  
        data.currency_id = data.currency.id;
        this.props.addProduct(data);
        console.log("add this", data);
        this.reset();
    }

    onEditProduct(id) {
     
        const data = _.find(this.state.data.products, {product: {id: parseInt(id)}});
        data.isEdition = true;
        this.setState({
            product_form: data
        });
        console.log("edit this", data);
    }

    onSaveProduct(data) {
     
        data.currency_id = data.currency.id;
        console.log("save this", data);
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

    onEditQuotationGroup() {
        console.log("TODO: open modal with data");
    }

    onSaveQuotationGroup(data) {
        
        // prepare data
        data.sale_id = this.props.sale_id;
                
        this.props.createQuotationGroup(data)
            .then(()=>{
                this.hideModal('quotation_group');
            });
    }

    onDeleteQuotationGroup(id) {
        
        const self = this;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará la cotización del listado",
        }).then(function () {
            // TODO: alert con resultado
            self.props.removeQuotationGroup(id)
                .then(_=>{
                    
            }).catch(err=>{
                
            }); 
        }, _=>{})  
    }

    hideModal(key) {
        this.reset();
        this.setState({
            modals: Object.assign({}, this.state.modals, {
                [key]: Object.assign({}, this.state.modals[key], {
                    isOpen: false
                })
            })
        });
    };

    /** 
     * Pass selected products array
     * Additionaly a group id if under edition 
     * And of course existing data if any
     * 
     * @param {array} rows 
     * @param {int} quotation_group_id Group of quoted products id 
     */
    onOpenQuotationModal(rows, quotation_group_id = null) {
       
        // empty object if new group, object data if edition
        let selected_group = {};
        if(quotation_group_id) {
            selected_group = this.props.data.quotation_groups.find(x=>x.quotation_group_id == quotation_group_id);
        } else {
            selected_group.products = rows;
        }

        this.props.selectQuotationProductsGroup(selected_group);
        
        this.setState({
            modals: Object.assign({}, this.state.modals, {
                quotation_group: Object.assign({}, this.state.modals.quotation_group, {
                    product_form: QuotationForm.defaultProps.product_form,
                    isOpen: true
                })
            })
        });     
    }

    onGenerateDocumentClicked() {

        this.props.getQuotationModels();

        this.setState({
            modals: Object.assign({}, this.state.modals, {
                models: Object.assign({}, this.state.modals.models, {
                    isOpen: true
                })
            })
        }); 
    }
    
    reset() {
        this.setState({
            product_form: QuotationForm.defaultProps.product_form
        });
    }

    render() {
       
        return (

            <View 
                handleInputChange={this.handleInputChange}
                handleOptionChange={this.handleOptionChange}
                handleDateChange={this.handleDateChange}
                handleProductChange={this.handleProductChange}

                data={this.state.data}
                form={this.state.product_form}
                modals={this.state.modals}
                quoted={this.props.quoted}

                product_types={this.props.product_types}
                products={this.props.products}
                currencies={this.props.currencies}
                shipment_types={this.props.shipment_types}

                onAddProduct={this.onAddProduct}
                onSaveProduct={this.onSaveProduct}
                onEditProduct={this.onEditProduct}
                onDeleteProduct={this.onDeleteProduct}
                
                onOpenQuotationModal={this.onOpenQuotationModal}
                onSaveQuotationGroup={this.onSaveQuotationGroup}
                onEditQuotationGroup={this.onEditQuotationGroup}
                onDeleteQuotationGroup={this.onDeleteQuotationGroup}
                onGenerateDocumentClicked={this.onGenerateDocumentClicked}
                calculateImportExpenditure={this.props.calculateImportExpenditure}
                hideModal={this.hideModal}

                reset={this.reset}
            />
        );
    }
}

export default QuotationForm