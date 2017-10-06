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
import ProductQuotationForm from 'Sales/containers/quotation/products/products_form'
import ProductsTable from 'Sales/components/quotation/products/table'
import QuotationGroupsTable from 'Sales/components/quotation/groups/table'
import QuotationGroupModal from 'Sales/containers/quotation/modals/quotation_group'
import ModelsListModal from 'Sales/components/quotation/modals/models'
import { formatChildfield } from 'Commons/utils/formatters'
import { Uploader } from 'Commons/components/form'
import { 
    handleInputChange, handleOptionChange, handleDateChange } from 'Commons/utils/forms'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { formatDateVisually } from 'Commons/utils/dates'

import swal from 'sweetalert2'

class QuotationForm extends Component {
    render() {

        const data = this.props.data;

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
                                            onChange={this.props.handleInputChange}
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
                                        value={formatDateVisually(data.date)}
                                        onDayChange={this.props.handleDateChange}
                                        dayPickerProps={dayPickerProps}
                                        />
                                </div>
                            </div>                 
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <ProductQuotationForm 
                                    data={this.props.form}
                                    product_types={this.props.product_types}
                                    products={this.props.products} 
                                    currencies={this.props.currencies} 
                                    onCancel={ this.props.reset }
                                    onAddProduct={this.props.onAddProduct}
                                    onSaveProduct={this.props.onSaveProduct}
                                    handleInputChange={this.props.handleInputChange}
                                    handleOptionChange={this.props.handleOptionChange}
                                    handleProductChange={this.props.handleProductChange}
                                />                                
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-sm-12">
                                <ProductsTable 
                                    products={ data.products.filter(x=>x.quotation_group_id == null) }  
                                    onEditProduct={ this.props.onEditProduct }
                                    onDeleteProduct={ this.props.onDeleteProduct }
                                    onOpenQuotationModal={ this.props.onOpenQuotationModal }
                                    />                               
                            </div>                 
                        </div>
                        
                        { this.props.data.selected_group && 
                            <QuotationGroupModal 
                                isOpen={ this.props.modals.quotation_group.isOpen } 
                                hideModal={ _=>this.props.hideModal('quotation_group') } 
                                saveModal={ this.props.onSaveQuotationGroup } 
                                shipment_types= { this.props.shipment_types }
                                currencies={this.props.currencies} 
                                data={this.props.data.selected_group}
                                calculateImportExpenditure={ this.props.calculateImportExpenditure }
                                />
                        }

                        { data.quotation_groups.length > 0 && 
                            <div className="row">
                                <hr />
                                <div className="col-sm-12">
                                    <QuotationGroupsTable
                                        products={ data.products } 
                                        quotation_groups={ data.quotation_groups } 
                                        onEditQuotationGroup={ this.props.onEditQuotationGroup }
                                        onDeleteQuotationGroup={ this.props.onDeleteQuotationGroup }
                                    />                                
                                </div>
                            </div>
                        }

                        <hr />

                        <div className="row">   
                            <div className="col-xs-12">
                                <button className="btn btn-info" 
                                    type="button"
                                    onClick={_=>this.props.onGenerateDocumentClicked()}>
                                    <i className="fa fa-file-word-o"></i> Generar Documento</button>
                            </div>
                        </div>

                        { this.props.data.quotation_models && this.props.data.quotation_models.length > 0 && 
                            <ModelsListModal 
                                isOpen={ this.props.modals.models.isOpen } 
                                hideModal={ _=>this.props.hideModal('models') } 
                                data={this.props.data.quotation_models}
                                />
                        }

                        <hr />
                        
                        { this.props.quoted &&
                          <div className="quoted">

                            <div className="row">
                                <div className="col-xs-12">
                                  <h4>Documentos de Cotización</h4>
                                </div>

                                <Uploader 
                                  name="quotation_doc"
                                  label=".doc"
                                  icon="fa fa-file-word-o"
                                  classnames="col-xs-6 col-md-4"
                                  link={this.props.data.quotation_doc}
                                  errorMessage="" />

                                <Uploader 
                                  name="quotation_pdf"
                                  label=".pdf"
                                  icon="fa fa-file-pdf-o"
                                  classnames="col-xs-4 col-md-4"
                                  link={this.props.data.quotation_pdf}
                                  errorMessage="" />
                            </div>

                            <div className="row">
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
                                                onChange={obj=>{this.props.handleOptionChange("currency", obj)}}
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
                                                onChange={this.props.handleInputChange}
                                                />
                                            <span className="input-group-addon">
                                                <span className="fa fa-usd"></span>
                                            </span>
                                        </div>
                                    </div>             
                                </div>
                            </div>                            
                          </div>
                        }
                        <input type="hidden" name="id" value={this.props.data.id} />                         
                    </div>
                </div>
            </div>
        );
    }
}

export default QuotationForm