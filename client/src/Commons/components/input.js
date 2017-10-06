
import React from 'react'

export class Input extends React.Component {

    defaultProps={
        placeholder: "",
    }

  render() {
    return ( 
        <div className={this.props.classnames}>
            <div className="form-group">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <div className="input-group">
                    <input
                        type="text"
                        name={this.props.name}
                        className="form-control"
                        placeholder={this.props.placeholder || this.props.label}
                        value={this.props.value}
                        onChange={this.props.handle}
                        />
                    { this.props.icon && 
                        <span className="input-group-addon">
                            <span className={this.props.icon}></span>
                        </span>
                    }
                </div>
            </div>             
        </div>
    );
  }
}

