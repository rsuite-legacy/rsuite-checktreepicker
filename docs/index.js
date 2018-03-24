import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Markdown } from 'markdownloader';
import { Row, Col } from 'rsuite';
import CodeView from 'react-code-view';
import cloneDeep from 'lodash/cloneDeep';
import { PageContainer } from 'rsuite-docs';
import 'react-code-view/lib/less/index.less';
import './less/index.less';
import '../src/less/index.less';
import Picker from '../src';
import treeData from './data/treeData';
import cityData from './data/city';

const babelOptions = {
  presets: ['stage-0', 'react', 'es2015'],
  plugins: ['transform-class-properties'],
};
class App extends Component {
  render() {
    return (
      <PageContainer
        activeKey="CheckTreePicker"
        githubURL="https://github.com/rsuite/rsuite-checktreepicker"
      >
        <Col md={10}>
          <a id="README" className="target-fix" />
          <Markdown>{require('../README.md')}</Markdown>

          <h2 id="examples">
            <code>示例</code>
          </h2>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/simple.md')}
                dependencies={{
                  treeData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/controlled.md')}
                dependencies={{
                  treeData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/disabled.md')}
                dependencies={{
                  treeData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/disabled-checkbox.md')}
                dependencies={{
                  treeData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/custom.md')}
                dependencies={{
                  cityData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/custom-icon.md')}
                dependencies={{
                  treeData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/inline.md')}
                dependencies={{
                  cityData,
                  Picker,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <CodeView
                source={require('./md/dynamic.md')}
                dependencies={{
                  treeData,
                  Picker,
                  cloneDeep,
                }}
                babelTransformOptions={babelOptions}
              />
            </Col>
          </Row>
          <h2 id="API">API</h2>
          <Markdown>{require('./md/props.md')}</Markdown>
        </Col>
      </PageContainer>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
