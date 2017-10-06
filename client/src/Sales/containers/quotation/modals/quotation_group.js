import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ProductsGroupForm from 'Sales/components/quotation/modals/quotation_group_form'
import { handleInputChange, handleOptionChange } from 'Commons/utils/forms'
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
  } from 'react-modal-bootstrap';

class QuotationModal extends Component {

    static propTypes = {
        data: PropTypes.object,
        shipment_types: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        isOpen: PropTypes.bool.isRequired,
        calculateImportExpenditure: PropTypes.func.isRequired,
        saveModal: PropTypes.func.isRequired,
        hideModal: PropTypes.func.isRequired
    }

    static defaultProps = { 
        data: {
            shipment_type: {},
            currency: {},
            type: {}
        }
    }
  
    constructor(props) {
        super(props);
       
        const fob_price = props.data.products.reduce(this.calculateFOB, 0);

        this.state = {
            data: Object.assign({}, 
                QuotationModal.defaultProps.data, 
                {
                    shipment_type: props.shipment_types[0],
                    currency: props.data.products[0].currency, // decide currency based on first product
                    fob_price: fob_price, // predefine FOB
                    total_expenditure: fob_price
                },
                props.data),
            pristine: true
        }
    
        this.handleInputChange = handleInputChange.bind(this);
        this.handleOptionChange = handleOptionChange.bind(this);
        this.handleImportExpenditureChange = this.handleImportExpenditureChange.bind(this);
        this.handleProfitabilityChange = this.handleProfitabilityChange.bind(this);
        this.handleTotalExpenditureChange = this.handleTotalExpenditureChange.bind(this);
        this.handleSalePriceChange = this.handleSalePriceChange.bind(this);
    } 

    componentWillReceiveProps(newProps) {
       
        const self = this;
        let newState = this.state;
        let importExpendiduteChanged = newProps.data.import_expenditure 
            && newProps.data.import_expenditure != this.state.data.import_expenditure;

        // set state from props (one time)
        if(this.state.pristine) {
            newState.data = Object.assign(newState.data, newProps.data);
            newState.pristine = false;
        }

        // calculated import expenditure
        if(importExpendiduteChanged) {
            newState.data.import_expenditure = newProps.data.import_expenditure;
            newState.data.total_expenditure = Number(this.state.data.fob_price) + Number(newProps.data.import_expenditure);
        }

        this.setState(newState, ()=>{
     
            if(importExpendiduteChanged) {
                self.handleImportExpenditureChange({
                    target: {
                        value: newState.data.import_expenditure
                    }
                });
            }
        });
    }

    handleImportExpenditureChange(e) {
      
        const import_expenditure = Number(e.target.value);
        this.setState({
            data: Object.assign({}, this.state.data, {
                import_expenditure
            })
        }, ()=>{
            // trigger total price calculation
            this.handleTotalExpenditureChange({
                target: {
                    value: Number(this.state.data.fob_price) + import_expenditure
                }
            });
        });
    }

    handleTotalExpenditureChange(e) {

        const rate = this.state.data.profitability;
        const total_expenditure = Number(e.target.value);
        const sale_price = rate ?
            ( total_expenditure * (Number(rate)/100)).toFixed(2) 
            : undefined;
  
        this.setState({
            data: Object.assign({}, this.state.data, {
                total_expenditure: total_expenditure.toFixed(2),
                sale_price
            })
        });
    }

    handleProfitabilityChange(e) {
        
        const rate = e.target.value;
        const sale_price = (Number(this.state.data.total_expenditure) * (Number(rate)/100)).toFixed(2);
        this.setState({
            data: Object.assign({}, this.state.data, {
                profitability: rate,
                sale_price
            })
        });
    }

    handleSalePriceChange(e) {

        const sale_price = Number(e.target.value);
        const profitability = (sale_price * 100 / (Number(this.state.data.total_expenditure)));
        this.setState({
            data: Object.assign({}, this.state.data, {
                sale_price,
                profitability: profitability.toFixed(2)
            })
        });
    }

    calculateFOB(fob, x) {
        return fob + (x.quantity * x.price);    
    }

    render() {
       
        return (

            <Modal isOpen={this.props.isOpen} onRequestHide={this.props.hideModal}>
                <ModalHeader>
                    <ModalClose onClick={this.props.hideModal}/>
                    <ModalTitle>Calculo de precio</ModalTitle>
                </ModalHeader>
                <ModalBody>      
                    { this.props.data.products && this.props.data.products.length > 0 &&
                        <ProductsGroupForm 
                            handleInputChange={this.handleInputChange}
                            handleOptionChange={this.handleOptionChange}
                            handleImportExpenditureChange={this.handleImportExpenditureChange}
                            handleProfitabilityChange={this.handleProfitabilityChange}
                            handleTotalExpenditureChange={this.handleTotalExpenditureChange}
                            handleSalePriceChange={this.handleSalePriceChange}
                            calculateImportExpenditure={this.props.calculateImportExpenditure}
                            shipment_types={this.props.shipment_types}
                            currencies={this.props.currencies} 
                            products={this.props.data.products}
                            data={this.state.data} />
                    }                     
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-default' onClick={this.props.hideModal} type="button">
                        Cerrar
                    </button>
                    <button className='btn btn-primary' onClick={()=>this.props.saveModal(this.state.data)} type="button">
                        Guardar
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default QuotationModal