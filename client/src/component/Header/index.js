import React from 'react';
import { Layout, Menu } from 'antd';

const Header = Layout.Header;

const HeaderComponent = () => (
    <Header className="header">
        <div className="logo" />
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
        >
            <Menu.Item key="1">患者管理</Menu.Item>
            <Menu.Item key="2">创建评定</Menu.Item>
            <Menu.Item key="3">开始评定</Menu.Item>
        </Menu>
    </Header>
);

export default HeaderComponent;