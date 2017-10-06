import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import config from '../../config/app.js'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import FlashMessages from '../../FlashMessages'
import Select from 'react-select'
import EnterprisesTable from './table'
import swal from 'sweetalert2'
import _ from 'lodash'

class EnterprisesList extends Component {

    static propTypes = {
        countries: PropTypes.array.isRequired,
        enterprises: PropTypes.array.isRequired,
        fetchCountryList: PropTypes.func.isRequired,
        fetchEnterpriseList: PropTypes.func.isRequired,
        onRemoveEnterprise: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired,  
        flashError: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);

        // bind actions
        this.filterByCountry = this.filterByCountry.bind(this);
        this.filterByClientType = this.filterByClientType.bind(this);

        this.state = {              
            client_types: [
                { 
                    key: 'cliente',
                    name: 'Cliente'
                },
                { 
                    key: 'otros_clientes',
                    name: 'Otros Clientes'
                }
            ],
            filters: {
                country: null,   
                client_type: 'cliente'      
            },
        };
    }

    componentDidMount() {

        const query = queryString.parse(location.search);

        // fetch data and apply predefined filters
        this.props.fetchCountryList().then(()=>{

            // apply predefined client type      
            if(query.client_type) {
                this.state.filters.client_type = query.client_type;  
            } 

            // apply predefined country             
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
            country_id: this.state.filters.country.id,
            client_type: this.state.filters.client_type
        };

        this.props.fetchEnterpriseList(filters);

        this.props.history.push({
            search: queryString.stringify(filters)
        });
    }

    /**
     * Filter by country
     * @param {*} selected 
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
     * Filter by Client type
     */
    filterByClientType(event) {
        this.setState({
            filters: Object.assign(this.state.filters, {
                client_type: event.target.value
            })
        }, _ => this.filter());    
    }   

    /**
     * On delete action clicked
     * @param {int} id 
     */
    onDeleteClicked(id) {
      
        const self = this;

        const enterprise = _.find(this.props.enterprises, {id});
        const name = enterprise.legal_name;

        swal({
            ... config.tables.onDeleteSwal,
            text: "Se eliminará la empresa " + name,
        }).then(function () {
            self.props.onRemoveEnterprise(id).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha eliminado la empresa " + name
                })
            }).catch(err=>{
                self.props.flashError({
                    text: "Hubo un error al eliminar la empresa " + name
                })
            }); 
        }, function(dismiss) {  
                  
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
                                <span className="caption-subject font-dark bold uppercase">Empresas</span>
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

                                            <div className="col-md-6 form-group">
                                                <Select
                                                name="country"
                                                placeholder="País..."
                                                value={country.value}
                                                options={this.props.countries}
                                                onChange={this.filterByCountry}
                                                />
                                            </div>

                                            <div className="col-md-4 form-group">
                                                <select className="form-control" value={this.state.filters.client_type} onChange={this.filterByClientType}>
                                                    { this.state.client_types.map( (type, key) => 
                                                        <option value={ type.key } key={key}>{ type.name }</option>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <div className="btn-group">
                                            <Link to="/empresas/alta" className='btn sbold green'>                                              
                                                <i className="fa fa-plus"></i> <span> Alta</span>                                
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                (this.props.enterprises) && 

                                <EnterprisesTable data={this.props.enterprises} 
                                    onDeleteClicked={this.onDeleteClicked.bind(this)} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EnterprisesList