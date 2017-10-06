import React, {Component} from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import config from 'Config/app.js'
import { formatChildfield } from 'Commons/utils/formatters'
import swal from 'sweetalert2'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import PrimaryTableActions from './primaryTableActions'
import TableWidget from './table.view'

class Table extends Component {

    static propTypes = {
        products: PropTypes.array.isRequired,
        quotation_groups: PropTypes.array.isRequired,
        onEditQuotationGroup: PropTypes.func.isRequired,
        onDeleteQuotationGroup: PropTypes.func.isRequired
    }
  
    constructor(props) {

        super(props);

        this.formatPrimaryTableActions = this.formatPrimaryTableActions.bind(this);
        this.formatProductNames = this.formatProductNames.bind(this);

        this.state = {     
            displayed: {}, 
            primaryTableColumns: [
                {
                    title: "Productos",
                    field: "id", // this ID represents group id
                    formatter: this.formatProductNames,
                    isKey: true,
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
                    title: "Gastos de Importación",
                    field: "import_expenditure",
                    width: "100"
                },
                {
                    title: "% Rentabilidad",
                    field: "profitability",
                    width: "100"
                },                
                {
                    title: "Precio de venta",
                    field: "sale_price",
                    width: "100"
                }, 
                {
                    title: "Acciones",
                    formatter: this.formatPrimaryTableActions, // already binded 
                    sort: false,
                    width: "120"
                }
            ],
            secondaryTableColumns: [
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
                }
            ]            
        }
    } 

    /**
     * Toogle product details
     * @param {*} row_id 
     */
    onDisplayDetail(row_id) {
        const displayed = this.state.displayed[row_id] || false;
        this.setState({
            displayed: Object.assign({}, this.state.displayed, {
                [row_id]: !displayed
            })
        })
    }

    formatProductNames(quotation_group_id) {
        const prods = this.props.products.filter(x=>x.quotation_group_id == quotation_group_id);
        const list = prods.map(x=>x.name).join(', ');
        return <p><span className='fa fa-list'></span> {list}</p> // return products name
    }

    /**
     * Table actions column
     * 
     * @param {*} cell 
     * @param {*} row 
     */
    formatPrimaryTableActions(cell, row) {
    
        const actions = <PrimaryTableActions 
            onEdit={this.props.onEditQuotationGroup.bind(this)} 
            onDelete={this.props.onDeleteQuotationGroup.bind(this)}
            onDisplayDetail={this.onDisplayDetail.bind(this)}
            onDownloadExcel={()=>{window.open(row.download_link)}} />;

        return React.cloneElement(actions, {
            id: row.product ? row.product.id : row.id,
            download_link: row.download_link ? row.download_link : null,
            secondaryTableDisplayed: this.state.displayed[row.id] || false
        });
    }

    render() {
       
        const self = this; 
      
        return (

            <div>
                <h4>Productos Cotizados</h4>
                {
                    this.props.quotation_groups.map((quotation_group, i)=>{
                     
                        // skip newly created group (when modal open)
                        if(!quotation_group.id)
                            return ''

                        const displaySecondaryTable = this.props.products && self.state.displayed[quotation_group.id] || false;

                        return (<TableWidget 
                            key={quotation_group.id}
                            index={i}
                            displaySecondaryTable={displaySecondaryTable}
                            quotation_group={[quotation_group]}
                            products={self.props.products.filter(x=>x.quotation_group_id == quotation_group.id)}
                            primaryTableColumns={self.state.primaryTableColumns}
                            secondaryTableColumns={self.state.secondaryTableColumns}
                        />)
                    })
                }
            </div>
        );
    }
}

export default Table