import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import Select from 'react-select'
import ReactQuill from 'react-quill'
import { 
    handleInputChange, handleOptionChange, 
    handleDateChange, handleQuillChange } from 'Commons/utils/forms'
import View from './form.main.view'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {      
            status: {},
            contact_mean: {},
            contacts: []     
        }
    };

    static propTypes = {
        data: PropTypes.object,
        enterprises: PropTypes.array.isRequired,
        contacts: PropTypes.array.isRequired,
        statuses: PropTypes.array.isRequired,
        currencies: PropTypes.array.isRequired,
        getSale: PropTypes.func.isRequired,
        getEnterprises: PropTypes.func.isRequired,
        getContacts: PropTypes.func.isRequired,
        getStatuses: PropTypes.func.isRequired,
        getContactMeans: PropTypes.func.isRequired,
        onAddSale: PropTypes.func.isRequired,
        onSaveSale: PropTypes.func.isRequired,
        unselectSale: PropTypes.func.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, Form.defaultProps, props, {
            pristine: true,
            isEdition: props.match.params.id ? true : false     
        });
      
        if(!this.state.isEdition) {
            // re assure we are creating from scratch
            this.props.unselectSale();
        }

        // events
        this.handleDateChange = handleDateChange.bind(this);
        this.handleInputChange = handleInputChange.bind(this);
        this.handleOptionChange = handleOptionChange.bind(this);
        this.handleQuillChange = handleQuillChange.bind(this);
        this.handleClienTypeChange = this.handleClienTypeChange.bind(this);
        this.handleEnterpriseChange = this.handleEnterpriseChange.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        const self = this;
            
        // fetch data under edition
        if(this.state.isEdition) {
            this.props.getSale(this.props.match.params.id).then(_=>{
                this.fetchData(); // fetch dropdowns data
            });
        }  else {            
            this.clear();
            this.fetchData();
        }  
    }

    fetchData() {
         
        const self = this;

        // fetch enterprise list
        this.props.getContactMeans()
            .then(()=> {
                return this.props.getStatuses();
            })
            .then(()=> {
                // this will load also contacs in cascade
                return this.fetchEnterprises();
            })
            .then(()=> {
                
                /**
                 * Contact means
                 */
                const contact_mean = (self.state.isEdition) ? 
                    _.find(self.props.contactMeans, {value: self.state.data.contact_mean}) 
                    : self.props.contactMeans[0];

                /**
                 * Statuses
                 */
                const status = (self.state.isEdition) ? 
                    _.find(self.props.statuses, {id: self.state.data.status.id}) 
                    : self.props.statuses[0];

                // set predefined items
                self.setState({
                    data: Object.assign({}, self.state.data, {
                        contact_mean,
                        status
                    }),
                    pristine: false
                });
            })
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} newProps 
     */
    componentWillReceiveProps(newProps) {
        if(this.state.pristine && !this.state.data.id) {
            this.setState({
                data: newProps.data
            });
        } else {
           
            const data = Object.assign({}, this.state.data, {
                quotation: {
                    products: newProps.data.quotation.products
                }
            });
        
            this.setState({data});
        }
    }

    handleClienTypeChange(client_type) {

        const self = this;

        // set predefined contact
        this.setState({
            data: Object.assign({}, this.state.data, {
                client_type,
                enterprise: {},
                contact: {}
            })
        }, _=> {
            self.fetchEnterprises({client_type});
        });        
    }

    handleEnterpriseChange(enterprise) {
       
        const self = this;
      
        if((enterprise.id)) {
            // fetch also contacts
            this.fetchContacts(enterprise.id).then(_=> {

                const contact = (self.state.isEdition) ? self.state.data.contact : {};

                // set predefined options
                self.setState({
                    data: Object.assign({}, self.state.data, {
                        enterprise,
                        contact
                    })
                });
            })
        } else {
            self.setState({
                data: Object.assign({}, self.state.data, {
                    enterprise
                })
            });
        }
    }

    fetchEnterprises(filters = {}) {

        const self = this;

        // fetch enterprise&contact lists
        return this.props.getEnterprises(filters).then(_=> {
            // set predefined enterprise
            const enterprise = (self.state.data.enterprise) ? self.state.data.enterprise : {};
            return self.handleEnterpriseChange(enterprise);
        });        
    }

    fetchContacts(enterprise_id) {

        const self = this;

        return this.props.getContacts(enterprise_id);
    }

    save(data) {

        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/tareas',
            search: queryString.stringify({
                enterprise_id: data.enterprise.value,
                status: data.status.value
            })
        }    

        if(!data.id) {
            // new
            this.props.onAddSale(data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado los datos"
                })
                this.clear();
                this.props.history.push(redirection);
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar los datos"
                })
            }); 
        } else {
            // update
            this.props.onSaveSale(data).then(_=>{
                this.props.flashSuccess({
                    text: "Se ha guardado el registro"
                })
                this.clear();
                this.props.history.push(redirection);
            }).catch(_=>{
                this.props.flashError({
                    text: "Hubo un error al guardar el registro"
                })
            });  
        }    
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data}); // reset state
        this.props.unselectSale(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
       
        return ( 
            <View data={this.state.data} 
                isEdition={this.state.isEdition}
                enterprises={this.props.enterprises}
                contacts={this.props.contacts}
                contactMeans={this.props.contactMeans}
                statuses={this.props.statuses}
                currencies={this.props.currencies}
                handleClienTypeChange={this.handleClienTypeChange}
                handleEnterpriseChange={this.handleEnterpriseChange}
                handleInputChange={this.handleInputChange}
                handleOptionChange={this.handleOptionChange}
                handleQuillChange={this.handleQuillChange}
                save={this.save}
                cancel={this.cancel}
            /> 
        )
    }
}

export default Form