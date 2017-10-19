import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Markdown } from 'markdownloader';
import { Header, Navbar, Nav, Row, Col } from 'rsuite';
import Affix from 'rsuite-affix';
import CodeComponent from './component/CodeComponent';
import {
  SimplePicker,
  CustomPicker,
  DisabledPicker,
  DropupPicker,
} from './component';
import './less/index.less';
import '../src/less/index.less';

class App extends Component {
  render() {
    return (
      <div className="doc-page">
        <Header inverse>
          <div className="container">
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#"><span className="prefix">R</span>Suite CheckTreePicker</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav>
                <Nav.Item href="#API">API</Nav.Item>
              </Nav>
              <Nav pullRight>
                <Nav.Item href="https://rsuite.github.io">RSuite</Nav.Item>
                <Nav.Item href="https://github.com/rsuite/rsuite-checktreepicker">GitHub</Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Header>

        <div className="container">
          <Row>
            <Col md={2} xsHidden smHidden>
              <Affix offsetTop={70}>
                <Nav pills stacked className="sidebar">
                  <Nav.Item href="#README"># 概述</Nav.Item>
                  <Nav.Item href="#examples"># 示例</Nav.Item>
                  <Nav.Item href="#dropup"># Dropup</Nav.Item>
                  <Nav.Item href="#disabled"># 禁用组件</Nav.Item>
                  <Nav.Item href="#custom"># 自定义Placeholder</Nav.Item>
                  <Nav.Item href="#more"># 更多用法</Nav.Item>
                  <Nav.Item href="#API"># API</Nav.Item>
                </Nav>
              </Affix>
            </Col>
            <Col md={10}>
              <a id="README" className="target-fix" />
              <Markdown>{require('../README.md')}</Markdown>

              <h2 id="examples"><code>示例</code></h2>
              <h5 id="simple"><code>基本用法</code></h5>
              <div className="example-item">
                {<SimplePicker />}
              </div>
              <CodeComponent md={require('./md/Simple.md')} />
              <br />

              <h5 id="dropup"><code>Dropup</code></h5>
              <div className="example-item">
                {<DropupPicker />}
              </div>
              <br />
              <p>autoAdjustPosition 属性默认值为 true， 会自动根据当前 CheckPicker 的位置，自动调整是 dropdown 还是dropup。</p>
              <p>如果配置手动配置 dropup 属性为 ture, 则 CheckPicker 只会向上展开。</p>
              <CodeComponent md={require('./md/Dropup.md')} />
              <br />

              <h5 id="disabled"><code>禁用组件</code></h5>
              <div className="example-item">
                {<DisabledPicker />}
              </div>
              <CodeComponent md={require('./md/Disabled.md')} />
              <br />

              <h5 id="custom"><code>自定义 Placeholder</code></h5>
              <div className="example-item">
                {<CustomPicker />}
              </div>
              <CodeComponent md={require('./md/Custom.md')} />
              <br />
              <h5 id="more"><code>更多用法</code></h5>
              <p>因为 rsuite-checktreepicker 是由 rsuite-check-tree 封装而来，所以 rsuite-check-tree 的所有用法都适用于 rsuite-checktreepicker</p>
              <p>更多用法请参照 <a href="https://rsuitejs.com/rsuite-check-tree/">rsuite-checkt-tree</a>。</p>
              <h2 id="API"><code>{'API'}</code></h2>
              <Markdown>
                {require('./md/props.md')}
              </Markdown>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />,
  document.getElementById('app')
);
