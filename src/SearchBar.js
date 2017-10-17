import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import locale from './locale/index';


const propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func
};

class SearchBar extends React.Component {

  handleChange = (event) => {
    const { onChange } = this.props;
    onChange && onChange(event.target.value, event);
  }

  render() {
    const {
      value,
      children,
      ...props
    } = this.props;

    const elementProps = omit(props, Object.keys(propTypes));
    return (
      <div
        {...elementProps}
        className="search-bar"
      >
        <input
          className="search-bar-input"
          value={value}
          onChange={this.handleChange}
          placeholder={locale.searchPlaceholder}
        />
        {children}
      </div>
    );
  }
}

SearchBar.propTypes = propTypes;


export default SearchBar;
