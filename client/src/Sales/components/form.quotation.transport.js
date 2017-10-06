import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import config from 'Config/app.js'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

class Form extends Component {

    static propTypes = {
        data: PropTypes.object,
        products: PropTypes.array.isRequired,
        shipment_types: PropTypes.array.isRequired,
        isEdition: PropTypes.bool,
    }

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: { 
            shipment_type: {},
            shipment_types: [],
            transport: {},
            type: {},
        }
    }

    constructor(props) {

        super(props);
        
        this.state = {
            ...props.data,
            ...Form.defaultProps.data
        }
    }

    componentWillReceiveProps(newProps) {
      
        const date = newProps.data.date ?  moment(newProps.data.date, config.dates.visual_format) : undefined;

        this.setState({
            ...newProps.data,
            date
        });
    }

    render() {

        const data = this.state;
      
        const selectRowProp = {
            mode: 'checkbox'
        };

        return (
           
            <div className="">        
                <form className="" role="form">
                    <div className="form-body">

                        <div className="row">

                            <div className="col-md-12">
                                    <BootstrapTable data={ this.props.products } selectRow={ selectRowProp }>
                                    <TableHeaderColumn dataField='id' isKey>Cantidad</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name'>Nombre</TableHeaderColumn>
                                    <TableHeaderColumn dataField='price'>Precio</TableHeaderColumn>
                                </BootstrapTable>
                                <hr/>
                            </div>

                            <div className="col-md-12">
                                <div className="row">

                                    <div className="col-xs-12">
                                        <div className="form-group">                    
                                            <Select
                                                name="shipment_type"
                                                clearable={false}
                                                placeholder="Forma de Transporte"
                                                value={this.state.shipment_type.value}
                                                options={this.props.shipment_types}
                                                onChange={obj=>{this.props.handleOptionChange("shipment_type", obj)}}
                                                />
                                        </div>
                                    </div>
                                </div>    
                                
                                <div className="row">
                                    <div className="col-lg-12">    
                                        <div className="portlet light bg-inverse">
                                            <div className="portlet-body">
                                                <div className="row">
                                                    <div className="col-xs-12">
                                                        <div className="form-group">
                                                            <label htmlFor="fob_price">FOB</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    name="fob_price"     
                                                                    className="form-control"
                                                                    placeholder="FOB"
                                                                    value={this.state.fob_price}
                                                                    onChange={this.props.handleInputChange}
                                                                    />
                                                                <span className="input-group-addon">
                                                                    <span className="fa fa-usd"></span>
                                                                </span>
                                                            </div>
                                                        </div>             
                                                    </div>

                                                    <div className="col-xs-12 col-lg-6">
                                                        <div className="form-group">
                                                            <label htmlFor="export_expenditure">Volumen</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    name="export_expenditure"     
                                                                    className="form-control"
                                                                    placeholder="Volumen"
                                                                    value={this.state.export_expenditure}
                                                                    onChange={this.props.handleInputChange}
                                                                    />                                                  
                                                            </div>
                                                        </div>             
                                                    </div>

                                                    <div className="col-xs-12 col-lg-6">
                                                        <div className="form-group">
                                                            <label htmlFor="export_expenditure">Peso</label>
                                                            <div className="input-group">
                                                                <input
                                                                    type="text"
                                                                    name="export_expenditure"     
                                                                    className="form-control"
                                                                    placeholder="Peso"
                                                                    value={this.state.export_expenditure}
                                                                    onChange={this.props.handleInputChange}
                                                                    />                                                  
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
                    </div>
                </form>                
            </div>

                     
        );
    }
}

export default Form