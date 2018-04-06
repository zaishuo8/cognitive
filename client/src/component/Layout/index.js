import React, { Component } from 'react';

import Header from '../../component/Header';
import Footer from '../../component/Footer';
import Breadcrumb from '../../component/Breadcrumb';

import { Layout } from 'antd';
const { Content } = Layout;

class LayoutComponent extends Component {
    render() {
        return (
            <Layout>
                <Header/>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb/>
                    {this.props.children}
                </Content>
                <Footer/>
            </Layout>
        );
    }
}

export default LayoutComponent;