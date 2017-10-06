import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import config from 'Config/app.js'
import { formatChildfield } from 'Commons/utils/formatters'
import swal from 'sweetalert2'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import Actions from './tableActions'

class Table extends Component {

    static propTypes = {
        products: PropTypes.array.isRequired,
        onEditProduct: PropTypes.func.isRequired,
        onDeleteProduct: PropTypes.func.isRequired
    }
  
    constructor(props) {

        super(props);

        this.formatTableActions = this.formatTableActions.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onRowSelect = this.onRowSelect.bind(this);
        this.onOpenQuotationModal = this.onOpenQuotationModal.bind(this);

        this.state = {     
            selected: [], 
            firstTableColumns: [
                {
                    title: "ID",
                    field: "id",
                    isKey: true,
                    width: "0"
                },
                {
                    title: "Cantidad",
                    field: "quantity",
                    width: "60"
                },
                {
                    title: "Producto",
                    field: "product.label",
                    formatter: formatChildfield,                    
                    width: "160"
                },
                {
                    title: "Moneda",
                    field: "currency.label",
                    formatter: formatChildfield,
                    width: "80"
                },
                {
                    title: "FOB",
                    field: "fob_price",
                    width: "100"
                },                 
                {
                    title: "Acciones",
                    formatter: this.formatTableActions, // already binded 
                    sort: false,
                    width: "60"
                }
            ]
        }
    } 

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatTableActions(cell, row) {
       
        const actions = <Actions onEdit={this.props.onEditProduct.bind(this)} onDelete={this.props.onDeleteProduct.bind(this)} />;
        return React.cloneElement(actions, {
            id: row.product ? row.product.id : row.id
        });
    }

    onRowSelect({ id }, isSelected) {
        if (isSelected) { 
          this.setState({
            selected: [ ...this.state.selected, id ].sort()
          });
        } else {  
          this.setState({ selected: this.state.selected.filter(it => it !== id) });
        }
        return false;
    }

    onSelectAll(isSelected) {
        if (!isSelected) {
            this.setState({ selected: [] });
        }
        return false;
    }

    onOpenQuotationModal() {
        const selected = this.props.products.filter(x=>{ return this.state.selected.indexOf(x.product.id) !== -1 });
      
        if(selected.length) {
            this.props.onOpenQuotationModal(selected);
        } else {
            swal({
                title: "Error de datos",
                type: 'warning',   
                text: "Seleccione uno o mas productos antes de utilizar esta funcionalidad.",
            })      
        }          
    }

    render() {

        // selected products (in quotation products table)
        const products = this.props.products;
     
        const selectRowProp = {
            mode: 'checkbox',
            onSelect: this.onRowSelect,
            onSelectAll: this.onSelectAll,
            selected: this.state.selected
        };
         
        return (

            <div>
                <h4>Productos a cotizar</h4>
                <BootstrapTable data={ products } selectRow={ selectRowProp }
                    options={{noDataText: 'No hay productos a cotizar'}} striped={true} hover={true} >                                    
                    {                                        
                        this.state.firstTableColumns.map((col, index)=>{
                            
                            return <TableHeaderColumn 
                                key={index}
                                dataField={col.field} 
                                isKey={col.isKey}
                                width={col.width}
                                dataFormat={col.formatter}
                                formatExtraData={col}
                                filterFormatted={!_.isNil(col.formatter)}
                                >{col.title}</TableHeaderColumn>
                        })
                    }
                </BootstrapTable>  

                <br />

                <div className="row with-padding">       
                    <div className="col-sm-12">
                        <button type="button" 
                            className="btn green-meadow pull-right"
                            onClick={this.onOpenQuotationModal}
                            >Calcular Precio</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Table