import React, {Component} from 'react'
import PropTypes from 'prop-types'
import TransportForm from './form.quotation.transport'
import {
    Modal,
    ModalHeader,
    ModalTitle,
    ModalClose,
    ModalBody,
    ModalFooter
  } from 'react-modal-bootstrap';

class ModalForm extends Component {

    static propTypes = {
        rows: PropTypes.array.isRequired,
        shipment_types: PropTypes.array.isRequired,
        isOpen: PropTypes.bool.isRequired,
        hideModal: PropTypes.func.isRequired
    }
  
    constructor(props) {
        super(props);
    } 

    render() {

        return (

            <Modal isOpen={this.props.isOpen} onRequestHide={this.props.hideModal}>
                <ModalHeader>
                    <ModalClose onClick={this.props.hideModal}/>
                    <ModalTitle>Calculo de precio</ModalTitle>
                </ModalHeader>
                <ModalBody>                           
                    <TransportForm 
                        shipment_types={this.props.shipment_types}
                        products={this.props.rows} />
                </ModalBody>
                <ModalFooter>
                    <button className='btn btn-default' onClick={this.props.hideModal}>
                        Cerrar
                    </button>
                    <button className='btn btn-primary'>
                        Guardar
                    </button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalForm