
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import Picker from '../src';
import treeData from '../docs/data/treeData';

const setup = () => {
  const props = {
    data: treeData
  };

  const wrapper = shallow(<Picker {...props} />);
  const fullRender = mount(<Picker {...props} />);
  const staticRender = render(<Picker {...props} />);
  return {
    wrapper,
    fullRender,
    staticRender
  };
};

describe('rsutie-checktrepicker test suite', () => {
  const { wrapper, fullRender, staticRender } = setup();

  it('picker should be render, there are class rsuite-checktreepicker-dropdown', () => {
    expect(wrapper.find('.rsuite-checktreepicker-dropdown'));
  });

  it('Picker placeholder text should be Please Select', () => {
    const text = staticRender.find('.placeholder-text > span').text();
    expect(text).toBe('Please Select');
  });

});

