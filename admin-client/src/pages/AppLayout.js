import React from 'react'
import { Layout, Menu } from 'antd';
import { HomeOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const headerStyle = {
	textAlign: 'center',
	color: '#fff',
	fontWeight: 'bold',
	fontSize: '20px',
	height: 64,
	paddingInline: 50,
	lineHeight: '64px',
};

const contentStyle = {
	textAlign: 'center',
	height: 'calc(100vh - 64px)',
	lineHeight: '120px',
	color: '#fff',
};

const siderStyle = {
	textAlign: 'center',
	lineHeight: '120px',
	color: '#fff',
};

function AppLayout() {
	const menuItems = [
		{
			title: 'Home',
			icon: HomeOutlined,
			url: '/',
			children: [
			]
		},
		{
			title: 'User',
			icon: UserOutlined,
			url: '/users',
			children: [
			]
		}
	]

	return (
		<Layout>
			<Header style={headerStyle}>Talker - Admin Panel</Header>
			<Layout hasSider>
				<Sider style={siderStyle}>
					<Menu
						mode="inline"
						defaultSelectedKeys={['0']}
						defaultOpenKeys={[]}
						style={{
							height: '100%',
						}}
						items={
							menuItems.map((item, index) => {
								return {
									key: index,
									icon: React.createElement(item.icon),
									label: item.title,
									url: item.url,
									children: item.children.map((subItem, j) => {
										const subKey = index * item.children.length + j + 1;
										return {
											key: subKey,
											label: subItem.title,

										};
									}),
								};
							})
						}
					/>
				</Sider>
				<Content style={contentStyle}>
					<Outlet />
				</Content>
			</Layout>
		</Layout>
	)
}

export default AppLayout