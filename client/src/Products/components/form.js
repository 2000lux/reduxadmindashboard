import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Validate from 'Commons/hoc/validate'
import View from './form.view'
import _ from 'lodash'

class Form extends Component {

    static defaultProps = {
        data: {
            name: '',
            code: '',
            type: {},
            provider: {},
            family: {},
            group: {},
            currency: {},
            price: ''
        }
    };

    static PropsType = {
        data: PropTypes.array,
        types: PropTypes.array.isRequired,
        providers: PropTypes.array.isRequired,
        families: PropTypes.array.isRequired,
        groups: PropTypes.array.isRequired,
        getProduct: PropTypes.func.isRequired,
        getProviders: PropTypes.func.isRequired,
        getFamilies: PropTypes.func.isRequired,
        getGroups: PropTypes.func.isRequired,
        unselectProduct: PropTypes.func.isRequired,
        onSaveProduct: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,        
        history: PropTypes.object.isRequired,  
        flashSuccess: PropTypes.func.isRequired,  
        flashError: PropTypes.func.isRequired
    }

    constructor(props = {}) {

        super(props)

        this.state = Object.assign({}, Form.defaultProps, props, {
            isEdition: props.match.params.id ? true : false,
            dataLoaded: false     
        });
       
        // events
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleFamilyChange = this.handleFamilyChange.bind(this);
        this.showErrorMessage = this.showErrorMessage.bind(this);
        this.save = this.save.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    /**
     * Get data
     */
    componentDidMount() {

        // fetch data under edition
        if(this.state.isEdition) {
            this.props.getProduct(this.props.match.params.id).then(_=>{                
                this.fetchData();
            });
        } else {
            this.fetchData();
        }  
    }

    fetchData() {

        const self = this;
        
        const lodash = _;

        // fulfill dropdowns
        this.props.getProviders().then(_=>{ 
            // apply predefined item
            const provider = (self.state.isEdition && self.state.data.provider) ? self.state.data.provider : self.props.providers[0];
            self.setState({ data: Object.assign(self.state.data, { provider })});
        })
        .then(_=>{
            return this.props.getFamilies().then(()=>{ 
                // apply predefined item
                const family = (self.state.isEdition && self.state.data.family) ? self.state.data.family : self.props.families[0];
                return self.handleFamilyChange(family, self.state.data.group);
            });
        })     
        .then(_=>{
            return this.props.getCurrencies().then(()=>{ 
                // apply predefined item
                const currency = (self.state.isEdition && self.state.data.currency) ? self.state.data.currency : self.props.currencies[0];
                self.setState({ data: Object.assign(self.state.data, { currency })});
            });
        })
        .then(_=>{

            // fulfill default type
            let type = self.props.types[0];

            if(self.state.isEdition) {
                let keyname;
                if(typeof self.state.data.type === 'string') {
                    keyname = self.state.data.type;
                } else {
                    keyname = self.state.data.type.value;
                }
                type = lodash.find(self.props.types, {value: keyname}) 
            }
           
            self.setState({ data: Object.assign(self.state.data, { type })},_=>{
                // flag
                self.setState({dataLoaded: true});  
            });
        });        
    }

    /**
     * Form data received for edition
     * 
     * @param {obj} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        
        let newState = {    
            types: nextProps.types,
            providers: nextProps.providers,
            families: nextProps.families,
            groups: nextProps.groups,
            currencies: nextProps.currencies
        };      
        
        /**
         * Handle current data vs props refresh
         * This is neccesary because of the group ddl, that changes dynamically
         */
        if(!this.state.isEdition) {
            // fresh form
            if(this.state.dataLoaded) {
                newState.data = {
                    ...nextProps.data,
                    ...this.state.data
                } 
            } else {
                newState.data = {
                    ...Form.defaultProps.data,
                    ...nextProps.data
                }
            }
        } else {

            if(this.state.dataLoaded) {
                // fresh form under edition
                newState.data = {
                    ...nextProps.data,
                    ...this.state.data
                } 
            } else {
                newState.data = {
                    ...nextProps.data
                } 
            }
        }
      
        this.setState(newState);
    }

    /**
     * Handle form interactions
     * @param {*} event 
     */
    handleInputChange(event) {

        const target = event.target;
        const value = target.value;
        const name = target.name;

        const data = Object.assign({}, this.state.data, {
            [name]: value
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

    handleFamilyChange(family, group = this.props.groups[1]) {

        const self = this;
        return this.props.getGroups(family.id).then(_=> {

            // set predefined group
            self.setState({ data: Object.assign(this.state.data, {
                family,
                group
            }) });
        })
    }

    save(data) {

        const self = this;
      
        if(!data.id) {
            return this.props.onAddProduct(data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                });
                self.clear();
                self.backToList();
            });  
        } else {
            return this.props.onSaveProduct(data).then(_=>{
                self.props.flashSuccess({
                    text: "Se ha guardado los datos"
                });
                self.clear();
                self.backToList();
            });    
        }      
    }

    showErrorMessage = () => {
        this.props.flashError({
            text: "Hubo un error al guardar los datos"
        })
    }

    cancel() {
        this.clear();
        this.backToList();
    }

    clear() {
        this.setState({ data: Form.defaultProps.data }); // reset state
        this.props.unselectProduct(); // redux action
    }

    backToList() {
        this.clear();
        this.props.history.goBack(); // redirect
    }

    render() {
        
        return (
          <Validate onSubmit={this.save} errorCallback={this.showErrorMessage}>
            {(errors, onSubmit) => {
                return (   
                  <View data={this.state.data} 
                      isEdition={this.state.isEdition}
                      types={this.props.types}
                      providers={this.props.providers}
                      families={this.props.families}
                      groups={this.props.groups}
                      currencies={this.props.currencies}
                      handleInputChange={this.handleInputChange}
                      handleOptionChange ={this.handleOptionChange}
                      handleFamilyChange ={this.handleFamilyChange}
                      errors={errors}
                      save={onSubmit}
                      cancel={this.cancel}
                  /> 
                )
            }}
          </Validate>
        );
    }
}

export default withRouter(Form)