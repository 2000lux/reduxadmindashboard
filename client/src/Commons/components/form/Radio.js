import React, {Component} from 'react'
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Radio extends Component {

  render() {
    const {name, selectedValue, onChange} = this.props;
    const optional = {};
    if(selectedValue !== undefined) {
      optional.checked = (this.props.value === selectedValue);
    }
    if(typeof onChange === 'function') {
      optional.onChange = onChange.bind(null, this.props.value);
    }
    
    return (
      <label className="mt-radio">
        {this.props.label}
        <input
          type="radio"
          name={name}
          {...optional} />
        <span></span>
      </label>
    );
  }
};

export class RadioGroup extends Component {

  static propTypes = {
    name: PropTypes.string,
    selectedValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func,
    children: PropTypes.node.isRequired
  }

  render() {

    const {name, selectedValue, onChange, children} = this.props;

    const classnames = classNames(this.props.classnames, {
      'has-error': this.props.errorMessage && this.props.errorMessage.props.children ? true : false
    });

    const childrenWithProps = React.Children.map(this.props.children,
      (child) => React.cloneElement(child, {
        name,
        selectedValue,
        onChange
      })
    );

    return (
        <div className={classnames}>
            <div className="form-group">
                <div className="mt-radio-inline">{childrenWithProps}</div>
                { this.props.errorMessage ? this.props.errorMessage : '' }   
            </div>              
        </div>      
        );
    }
};