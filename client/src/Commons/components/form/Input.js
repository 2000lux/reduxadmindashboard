
import React from 'react'
import classNames from 'classnames';

/**
 * Basic usage:
 *
   <Input
      classnames="col-xs-12 col-sm-8 col-md-10 col-lg-7"
      label="Dirección"
      name="address"
      value={data.address}
      handle={this.props.handleInputChange}
      errorMessage={errors.messageContainer(errors['address'])}
      />

 * More options:
 * placeholder="Dirección"
 * inputclass="text-uppercase"
 */
export class Input extends React.Component {

  static defaultProps = {
    type: "text",
    classnames: "",
    label: undefined,
    placeholder: "", // defaults to label
    name: undefined,
    value: undefined,
    inputclass: "form-control",
    handle: _=>{},
    errorMessage: undefined // validation obj
  }

  render() {

    const classnames = classNames(this.props.classnames, {
      'has-error': this.props.errorMessage && this.props.errorMessage.props.children ? true : false
    });

    const input_group = this.props.icon;

    return (
        <div className={classnames}>
            <div className="form-group">
                <label htmlFor={this.props.name}>{this.props.label}</label>
                <div className={input_group ? "input-group" : ""}>
                    <input
                        type={this.props.type}
                        name={this.props.name}
                        className={this.props.inputclass}
                        placeholder={this.props.placeholder || this.props.label}
                        value={this.props.value}
                        onChange={this.props.handle} />
                    { this.props.icon &&
                        <span className="input-group-addon">
                            <span className={this.props.icon}></span>
                        </span>
                    }
                </div>
                { this.props.errorMessage ? this.props.errorMessage : '' }
            </div>
        </div>
    );
  }
}

export const InputPassword = props => (
  <Input type="password" {...props} />
)
