import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Picker from '../src';

Enzyme.configure({ adapter: new Adapter() });

describe('ChectTree test suite', () => {
  it('Should load data async', () => {
    const data = [
      {
        label: 'Master',
        value: 'Master',
      },
      {
        label: 'async',
        value: 'async',
        children: [],
      },
    ];
    const children = [
      {
        label: 'children1',
        value: 'children1',
      },
    ];
    let newData = [];
    const mockOnExpand = (node, l, concat) => {
      newData = concat(data, children);
    };

    const instance = mount(
      <Picker
        data={data}
        onExpand={mockOnExpand}
        inline
        cascade={false}
        expandAll
      />,
    );
    instance
      .find('div[data-ref="0-1"]  > .rs-picker-checktree-view-node-expand-icon')
      .simulate('click');
    instance.setProps({
      data: newData,
    });
  });
});
