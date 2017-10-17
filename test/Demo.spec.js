
import React from 'react';
import RsuiteDemo from '../src/component/App';
import { shallow } from 'enzyme';

const setup = () => {
  const props = {
    name: 'RsuiteDemo'
  };

  const wrapper = shallow(<RsuiteDemo {...props} />)
  return {
    props,
    wrapper
  };
};

describe('RsuiteDemo test', () => {
  const { props, wrapper } = setup();

  // 通过 input 是否存在来判断 Todo组件是否被渲染
  it('Todo item should  render', () => {
    expect(wrapper.find('.demo-rsuite').exists());
  });
});

