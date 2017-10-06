import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import _ from 'lodash'
import config from 'Config/app.js'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Input, DropdownList } from 'Commons/components/form'

const ModalForm = (props) => {
  
    const container_sizes = [
        {id: 1, value: "20", label: "20 pies"},
        {id: 2, value: "30", label: "30 pies"},
        {id: 3, value: "40", label: "40 pies"}
    ]

    const data = props.data;

    return (
        <div className="quotation-products-modal">        
            <div className="form-body">

                <div className="row">

                    <div className="col-md-12">
                        <BootstrapTable data={ props.products }>
                            <TableHeaderColumn dataField='quantity'>Cantidad</TableHeaderColumn>
                            <TableHeaderColumn dataField='name' isKey>Nombre</TableHeaderColumn>
                            <TableHeaderColumn dataField='price'>Precio</TableHeaderColumn>
                        </BootstrapTable>
                        <hr/>
                    </div>

                    <div className="col-md-12">

                        <div className="row">

                            <DropdownList 
                                classnames="col-xs-12"
                                label="Forma de Transporte"
                                name="shipment_type"
                                list={props.shipment_types}
                                value={data.shipment_type.value}
                                clearable={false}
                                handle={props.handleOptionChange}
                            />
                        </div>    

                        { ( data.shipment_type.value === 'avion' || 
                            data.shipment_type.value === 'EMS' || 
                            data.shipment_type.value === 'maritimo-consolidado' || 
                            data.shipment_type.value === 'maritimo-en-contenedor') &&

                            <div>

                                <div className="row">
                                    <div className="col-lg-12">    
                                        <div className="portlet light bg-inverse">
                                            <div className="portlet-body">
                                                <div className="row">

                                                    { data.shipment_type.value !== 'FOB' && 
                                                    data.shipment_type.value !== 'terrestre' &&

                                                        <Input 
                                                            classnames="col-xs-12 col-lg-6"
                                                            label="FOB"
                                                            name="fob_price"
                                                            value={data.fob_price}
                                                            icon="fa fa-usd"
                                                            handle={props.handleInputChange}
                                                        />
                                                    }

                                                    { (data.shipment_type.value === 'avion' || 
                                                    data.shipment_type.value === 'maritimo-consolidado') &&

                                                        <Input 
                                                            classnames="col-xs-12 col-lg-6"
                                                            label="Volumen"
                                                            name="volume"
                                                            value={data.volume}
                                                            handle={props.handleInputChange}
                                                        />
                                                    }

                                                    { (data.shipment_type.value === 'avion' || 
                                                        data.shipment_type.value === 'EMS') &&
                                                        <Input 
                                                            classnames="col-xs-12 col-lg-6"
                                                            label="Peso"
                                                            name="weight"
                                                            value={data.weight}
                                                            handle={props.handleInputChange}
                                                        />
                                                    }

                                                    { data.shipment_type.value === 'maritimo-en-contenedor' && 

                                                        <div>                                                            
                                                            <Input 
                                                                classnames="col-xs-12 col-lg-6"
                                                                label="Cantidad de Contenedores"
                                                                name="containers_quantity"
                                                                value={data.containers_quantity}
                                                                handle={props.handleInputChange}
                                                            />

                                                            <DropdownList 
                                                                classnames="col-xs-12 col-lg-6"
                                                                label="Tamaño"
                                                                name="size"
                                                                value={data.size}
                                                                list={container_sizes}
                                                                clearable={false}
                                                                handle={props.handleOptionChange}
                                                            />

                                                            <Input 
                                                                classnames="col-xs-12 col-lg-6"
                                                                label="Transporte Cliente"
                                                                name="client_transport"
                                                                value={data.client_transport}
                                                                handle={props.handleInputChange}
                                                            />
                                                        </div>
                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">

                                    <div className="col-sm-6 col-lg-6">        
                                        <div className="form-group">
                                            <label htmlFor="fob_price">&nbsp;</label>
                                            <div>
                                                <button className="btn green-meadow pull-right" 
                                                    type="button"
                                                    onClick={ ()=>props.calculateImportExpenditure(data) }>Calcular</button>
                                            </div>
                                        </div>
                                    </div>

                                    <Input 
                                        classnames="col-xs-12 col-sm-6 col-lg-6"
                                        label="Gasto de importación"
                                        name="import_expenditure"
                                        value={data.import_expenditure}
                                        icon="fa fa-usd"
                                        handle={props.handleImportExpenditureChange}
                                    />
                                </div>
                            </div>
                        }

                        <div className="row">

                            <Input 
                                classnames="col-xs-12 col-lg-6"
                                label="Gastos totales"
                                name="total_expenditure"
                                value={data.total_expenditure}
                                handle={props.handleTotalExpenditureChange}
                            />

                            <Input 
                                classnames="col-sm-12 col-lg-6"
                                label="% Rentabilidad"
                                name="profitability"
                                value={data.profitability}
                                icon="fa fa-usd"
                                handle={props.handleProfitabilityChange}
                            />
                        </div>

                        <div className="row">
                        
                            <DropdownList 
                                classnames="col-sm-12 col-lg-6"
                                label="Moneda"
                                name="currency"
                                list={props.currencies}
                                value={data.currency.value}
                                clearable={false}
                                handle={props.handleOptionChange}
                            />

                            <Input 
                                classnames="col-sm-12 col-lg-6"
                                label="Precio de venta"
                                name="sale_price"
                                value={data.sale_price}
                                icon="fa fa-usd"
                                handle={props.handleSalePriceChange} 
                            />

                            <input type="hidden" name="quotation_group_id" value={data.quotation_group_id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalForm