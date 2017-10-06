import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import ProductsTable from './table'
import FlashMessages from '../../FlashMessages'
import swal from 'sweetalert2'
import _ from 'lodash'

class ProductsList extends Component {

    static propTypes = {
        products: PropTypes.array.isRequired,
        fetchProductList: PropTypes.func.isRequired,
        unselectProduct: PropTypes.func.isRequired,
        onRemoveProduct: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired,  
        flashError: PropTypes.func.isRequired
    }

    constructor(props) {
       super(props)       
    }

    componentWillMount() {

        // fetch data
        this.props.fetchProductList();

        this.props.unselectProduct(); // remove seleted item if any
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
      
        const self = this;

        const product = _.find(this.props.products, {id});
        const name = product.name;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el producto " + name,
        }).then(function () {
            self.props.onRemoveProduct(id).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha eliminado el producto " + name
                })
            }).catch(err=>{
                self.props.flashError({
                    text: "Hubo un error al eliminar el producto " + name
                })
            }); 
        }, function(dismiss) {  
               
        })  
    }
 
    render() {
  
        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Productos</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            <div className="table-toolbar">
                                <div className="row">
                                    <div className="col-md-12 text-right">
                                        <div className="btn-group">
                                            <Link to="/productos/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Alta</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (this.props.products) && 

                                <ProductsTable data={this.props.products} 
                                    onDeleteClicked={this.onDeleteClicked.bind(this)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProductsList)