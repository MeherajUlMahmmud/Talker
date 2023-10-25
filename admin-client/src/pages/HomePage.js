import React, { useState } from 'react'
import { Divider, Radio, Table } from 'antd';

const data = [
	{
		key: '1',
		name: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
	},
	{
		key: '2',
		name: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
	},
	{
		key: '3',
		name: 'Joe Black',
		age: 32,
		address: 'Sydney No. 1 Lake Park',
	},
	{
		key: '4',
		name: 'Disabled User',
		age: 99,
		address: 'Sydney No. 1 Lake Park',
	},
];

const rowSelection = {
	onChange: (selectedRowKeys, selectedRows) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	getCheckboxProps: (record) => ({
		disabled: record.name === 'Disabled User',
		// Column configuration not to be checked
		name: record.name,
	}),
};

function HomePage() {
	const [filteredInfo, setFilteredInfo] = useState({});
	const [sortedInfo, setSortedInfo] = useState({});
	const handleChange = (pagination, filters, sorter) => {
		console.log('Various parameters', pagination, filters, sorter);
		setFilteredInfo(filters);
		setSortedInfo(sorter);
	};
	const clearFilters = () => {
		setFilteredInfo({});
	};
	const clearAll = () => {
		setFilteredInfo({});
		setSortedInfo({});
	};
	const setAgeSort = () => {
		setSortedInfo({
			order: 'descend',
			columnKey: 'age',
		});
	};
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			filters: [
				{
					text: 'Joe',
					value: 'Joe',
				},
				{
					text: 'Jim',
					value: 'Jim',
				},
			],
			filteredValue: filteredInfo.name || null,
			onFilter: (value, record) => record.name.includes(value),
			sorter: (a, b) => a.name.length - b.name.length,
			sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
			ellipsis: true,
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age',
			sorter: (a, b) => a.age - b.age,
			sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
			ellipsis: true,
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
			filters: [
				{
					text: 'London',
					value: 'London',
				},
				{
					text: 'New York',
					value: 'New York',
				},
			],
			filteredValue: filteredInfo.address || null,
			onFilter: (value, record) => record.address.includes(value),
			sorter: (a, b) => a.address.length - b.address.length,
			sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
			ellipsis: true,
		},
	];

	const [selectionType, setSelectionType] = useState('checkbox');

	return (
		<div>
			<Radio.Group
				onChange={({ target: { value } }) => {
					setSelectionType(value);
				}}
				value={selectionType}
			>
				<Radio value="checkbox">Checkbox</Radio>
				<Radio value="radio">radio</Radio>
			</Radio.Group>

			<Divider />

			<Table
				rowSelection={{
					type: selectionType,
					...rowSelection,
				}}
				columns={columns}
				dataSource={data}
			/>
		</div>
	);
}

export default HomePage