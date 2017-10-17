import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import _ from 'lodash';
import decorate from './utils/decorate';

const propTypes = {
  value: PropTypes.any,
  cleanable: PropTypes.bool,
  onClean: PropTypes.func
};

class DropdownToggle extends React.Component {

  renderToggleClean() {

    const { onClean } = this.props;
    return (
      <div
        className={this.prefix('toggle-clean')}
        role="button"
        tabIndex="-1"
        onClick={(e) => {
          onClean && onClean();
          e.stopPropagation();
        }}
      >
        ✕
      </div>
    );
  }

  render() {

    const {
      children,
      className,
      value,
      cleanable,
      ...props
    } = this.props;

    const classes = classNames(this.prefix('toggle'), className);
    const elementProps = _.omit(props, Object.keys(propTypes));

    return (
      <button
        {...elementProps}
        type="button"
        className={classes}
      >
        <div className={this.prefix('toggle-placeholder')} >
          {children}
        </div>
        <span className={this.prefix('toggle-arrow')} />
        {value && !!value.length && cleanable && this.renderToggleClean()}
      </button>
    );
  }
}

DropdownToggle.propTypes = propTypes;

export default decorate()(DropdownToggle);
