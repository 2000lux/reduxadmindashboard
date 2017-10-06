
import React from 'react'
import Select from 'react-select'

export class DropdownList extends React.Component {

    defaultProps={
        placeholder: "Seleccione...",
        clearable: true,
        list: [],
        data: {}
    }

    render() {
        return (
        <div className={this.props.classnames}>
                <div className="form-group">
                    <label>{this.props.label}</label>
                    { this.props.list && this.props.data &&    
                        <Select
                            name={this.props.name}
                            clearable={this.props.clearable}
                            placeholder={this.props.placeholder}
                            value={this.props.data.id}
                            options={this.props.list}
                            onChange={obj=>{this.props.handle(this.props.name, obj)}}
                            />
                    }
                </div>         
            </div>
        );
    }
}

