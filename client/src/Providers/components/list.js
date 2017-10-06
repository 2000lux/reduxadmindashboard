import React, {Component} from 'react'
import PropTypes from 'prop-types'
import config from '../../config/app.js'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import FlashMessages from '../../FlashMessages'
import Select from 'react-select'
import ProvidersTable from './table'
import swal from 'sweetalert2'
import _ from 'lodash'

class ProvidersList extends Component {

    static propTypes = {
        countries: PropTypes.array.isRequired,
        providers: PropTypes.array.isRequired,
        fetchCountryList: PropTypes.func.isRequired,
        fetchProviderList: PropTypes.func.isRequired,
        onRemoveProvider: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired,  
        flashError: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        // bind actions
        this.filterByCountry = this.filterByCountry.bind(this);

        // define default filters
        this.state = {           
            filters: {
                country: null,               
            }
        };
    }

    componentDidMount() {

        const query = queryString.parse(location.search);

        // fetch data
        this.props.fetchCountryList().then(()=>{

            // apply predefined filters
            const country_id = query.country_id ? query.country_id : config.defaults.country;
            this.state.filters.country = _.find(this.props.countries, {id: parseInt(country_id)});
            this.filter();
        }); 
    }

    /**
     * Gathers all current filters and dispatchs an action
     */
    filter() { 

        const filters = {
            country_id: this.state.filters.country.id
        }

        this.props.fetchProviderList(filters);

        this.props.history.push({
            search: queryString.stringify(filters)
        });
    }

    /**
     * Filter by country
     * @param {*} value 
     */
    filterByCountry(selected = {}) { 
        const country = selected || {};
        this.setState({
            filters: Object.assign(this.state.filters, {
                country
            })
        }, _ => this.filter());         
    }

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {

        const self = this;

        const provider = _.find(this.props.providers, {id});
        const name = provider.legal_name;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará el proveedor",
        }).then(function () {
            self.props.onRemoveProvider(id).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha eliminado el proveedor " + name
                })
            }).catch(err=>{
                this.props.flashError({
                    text: "Hubo un error al eliminar el proveedor " + name
                })
            }); 
        }, function(dismiss) {  
            console.log("dismiss deleting");          
        })  
    }

    render() {

        const country = this.state.filters.country || {};
     
        return (
            <div className="row">
                <div className="col-md-12">

                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-dark hide"></i>
                                <span className="caption-subject font-dark bold uppercase">Proveedores</span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="messages">
                                <FlashMessages />
                            </div>
                            
                            <div className="table-toolbar">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="row">

                                            <div className="col-md-4 form-group">
                                                <Select
                                                    name="country"
                                                    placeholder="País..."
                                                    value={country.value}
                                                    options={this.props.countries}
                                                    onChange={this.filterByCountry}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <div className="btn-group">
                                            <Link to="/proveedores/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Alta</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {
                                (this.props.providers) && 

                                <ProvidersTable data={this.props.providers} 
                                    onDeleteClicked={this.onDeleteClicked.bind(this)} />
                            }                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(ProvidersList)