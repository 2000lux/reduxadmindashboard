import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import queryString from 'query-string'
import View from './form.view'
import Validate from 'Commons/hoc/validate'

class Form extends Component {

    /**
     * Pre-declaring nested fields
     */
    static defaultProps = {
        data: {          
            'id': '',
            'legal_name': '',
            'cuit': '',
            'town': '',
            'address': '',
            'zipcode': '',
            'phone': '',       
            'observations': '',
            'client_type': '',
            'country': {},
            'province': {},
            'bidding_web': {
                'link': '',
                'user': '',
                'password': ''
            },
            'invoice_web': {
                'link': '',
                'user': '',
                'password': ''
            }
        }
    };

    static propTypes = {
        data: PropTypes.object,
        countries: PropTypes.array.isRequired,
        provinces: PropTypes.array.isRequired,
        getEnterprise: PropTypes.func.isRequired,
        getCountries: PropTypes.func.isRequired,
        getProvinces: PropTypes.func.isRequired,
        onAddEnterprise: PropTypes.func.isRequired,
        onSaveEnterprise: PropTypes.func.isRequired,
        unselectEnterprise: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired,  
        flashError: PropTypes.func.isRequired
    }

    constructor(props) {

        super(props);

        this.state = Object.assign({}, Form.defaultProps, props, {
            isEdition: props.match.params.id ? true : false,
            pristine: true     
        });
      
        // events
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleQuillChange = this.handleQuillChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleNestedValueChange = this.handleNestedValueChange.bind(this);
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
            this.props.getEnterprise(this.props.match.params.id).then(_=>{
                this.fetchData();
            });
        }  else {       
            this.clear();
            this.fetchData();
        }  
    }

    fetchData() {
         
        const self = this;

        // fetch country/provinces list
        this.props.getCountries().then(()=> {
            // set predefined country
            const country = (self.state.isEdition) ? self.state.data.country : self.props.countries[1];
            self.handleCountryChange(country, self.state.data.province);

            this.setState({pristine: false});
        });
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} nextProps 
     */
    componentWillReceiveProps(nextProps) {

        // pristine
        if(this.state.pristine) {
            this.setState({
                data: {
                    ...Form.defaultProps.data,
                    ...nextProps.data
                }
            });
        }
    }

    handleCountryChange(country, province = this.props.provinces[1]) {
       
        const self = this;
       
        this.props.getProvinces(country.id).then(_=> {

            // set predefined province
            self.setState({
                data: Object.assign({}, self.state.data, {
                    country,
                    province
                })
            });
        })
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        const data = Object.assign({}, this.state.data, {
            [name]: value
        })

        this.setState({ data });
    }

    /**
     * Handle Quill wysiwyg
     * @param {*} event 
     */
    handleQuillChange(field, value) {

        const data = Object.assign({}, this.state.data, {
            [field]: value
        })

        this.setState({ data });
    }

    /**
     * Handle dropdowns changes 
     * @param {*} field name
     * @param {*} value 
     */
    handleOptionChange(field, value) {

        const data = Object.assign({}, this.state.data, {
            [field]: value
        })

        this.setState({ data });
    }

    /**
     * Handle form nested values
     * @param {*} event 
     */
    handleNestedValueChange(parent, field, event) {

        const value = event.target.value;
      
        const data = Object.assign({}, this.state.data, {
            [parent]: Object.assign({}, this.state.data[parent], {
                [field]: value
            })
        })

        this.setState({ data });
    }

    showErrorMessage = () => {
      this.props.flashError({
          text: "Hubo un error al guardar los datos"
      })
    }

    save(data) {
        
        // will redirect to filtered list after saving
        const redirection = {
            pathname: '/empresas',
            search: queryString.stringify({
                country_id: data.country,
                client_type: data.client_type
            })
        }     

        const self = this;
   
        if(!data.id) {
            return this.props.onAddEnterprise(data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado la empresa"
                });
                self.clear();
                self.props.history.push(redirection);
            });  
        } else {
            return this.props.onSaveEnterprise(data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                });
                self.clear();
                self.props.history.push(redirection);
            });    
        }        
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data}); // reset state
        this.props.unselectEnterprise(); // redux action
    }

    backToList() {
        this.props.history.goBack(); // redirect
    }

    render() {
     
        return ( 
            <Validate onSubmit={this.save} errorCallback={this.showErrorMessage}>
                {(errors, onSubmit) => {
                  return (
                    <View data={this.state.data} 
                      isEdition={this.state.isEdition}
                      countries={this.props.countries}
                      provinces={this.props.provinces}
                      handleCountryChange={this.handleCountryChange}
                      handleInputChange={this.handleInputChange}
                      handleQuillChange={this.handleQuillChange}
                      handleOptionChange={this.handleOptionChange}
                      handleNestedValueChange={this.handleNestedValueChange}
                      errors={errors}
                      save={onSubmit}
                      cancel={this.cancel} />  
                  )
                }}
            </Validate>
        )
    }
}

export default Form