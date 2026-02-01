import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table } from '@consta/uikit/Table'
import { Button } from '@consta/uikit/Button'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { Radio } from '@consta/uikit/Radio'
import { IconAdd } from '@consta/icons/IconAdd'
import { IconTrash } from '@consta/icons/IconTrash'
import { IconEdit } from '@consta/icons/IconEdit'

const Customer = () => {
	const columns = [
		{
			title: 'Код клиента',
			accessor: 'customerCode',
			width: 100,
			sortable: true,
			renderCell: row => row.customerCode || 'Нет данных'
		},
		{
			title: 'ФИО',
			accessor: 'customerName',
			sortable: true,
			renderCell: row => row.customerName || 'Нет данных'
		},
		{
			title: 'ИНН',
			accessor: 'customerInn',
			sortable: true,
			renderCell: row => row.customerInn || 'Нет данных'
		},
		{
			title: 'КПП',
			accessor: 'customerKpp',
			sortable: true,
			renderCell: row => row.customerKpp || 'Нет данных'
		},
		{
			title: 'Юр.адрес',
			align: 'center',
			accessor: 'customerLegalAddress',
			width: 150,
			withoutPadding: true,
			sortable: true,
			renderCell: row => (
				<div
					style={{
						padding: '10px 5px'
					}}
				>
					{row.customerLegalAddress || 'Нет данных'}
				</div>
			)
		},
		{
			title: 'Почтовый адрес',
			align: 'center',
			accessor: 'customerPostalAddress',
			width: 150,
			withoutPadding: true,
			sortable: true,
			renderCell: row => (
				<div
					style={{
						padding: '10px 5px'
					}}
				>
					{row.customerPostalAddress || 'Нет данных'}
				</div>
			)
		},
		{
			title: 'Электронная почта',
			align: 'center',
			accessor: 'customerEmail',
			width: 150,
			withoutPadding: true,
			sortable: true,
			renderCell: row => (
				<div
					style={{
						padding: '10px 5px',
						wordBreak: 'break-all', // Перенос в любом месте
						whiteSpace: 'normal', // Разрешаем перенос строк
						overflowWrap: 'break-word' // Перенос длинных слов
					}}
				>
					{row.customerEmail || 'Нет данных'}
				</div>
			)
		},
		{
			title: 'Вышестоящий клиент',
			accessor: 'customerCodeMain',
			align: 'center',
			width: 150,
			withoutPadding: true,
			sortable: true,
			renderCell: row => (
				<div
					style={{
						padding: '10px 5px'
					}}
				>
					{row.customerCodeMain || 'Нет данных'}
				</div>
			)
		},
		{
			title: 'Юр.лицо',
			accessor: 'isOrganization',
			sortable: true,
			width: 100,
			renderCell: row => (row.isOrganization ? 'Да' : 'Нет')
		},
		{
			title: 'Физ.лицо',
			accessor: 'isPerson',
			sortable: true,
			width: 100,
			renderCell: row => (row.isPerson ? 'Да' : 'Нет')
		}
	]

	const [customers, setCustomers] = useState([])

	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [selectedValue, setSelectedValue] = useState(null)

	const handleDeleteClick = row => {
		setSelectedValue(row.id)
		setDeleteModalOpen(true)
	}

  const deleteCustomer = async (id) => {
    await axios.delete(`http://localhost:8080/customers/${id}`).then(_ => getCustomers()).catch(e => console.log(e))
  }

	const confirmDelete = async () => {
    deleteCustomer(selectedValue);
	  setDeleteModalOpen(false);
	  setSelectedValue(null);
	};


  const stringValue = selectedValue ? String(selectedValue) : null;

	const getCustomers = async () => {
		await axios
			.get('http://localhost:8080/customers')
			.then(res => {
				console.log(res.data)
				setCustomers(res.data)
			})
			.catch(e => console.log(e))
	}

	useEffect(() => {
		getCustomers()
	}, [])
	return (
		<>
			<div
				style={{
					paddingBottom: '20px',
					display: 'flex',
					width: '200px',
					justifyContent: 'space-between'
				}}
			>
				<Button label='Закрыть' iconLeft={IconAdd} onlyIcon />
				<Button label='Закрыть' iconLeft={IconEdit} onlyIcon />
				<Button label='Закрыть' iconLeft={IconTrash} onlyIcon onClick={handleDeleteClick} />
			</div>
			<Table
				borderBetweenColumns
				borderBetweenRows
				stickyHeader
				columns={columns}
				rows={customers}
			/>

			<Modal
				isOpen={deleteModalOpen}
				hasOverlay
				onClickOutside={() => setDeleteModalOpen(false)}
				onEsc={() => setDeleteModalOpen(false)}
			>
				<div style={{ padding: '24px', minWidth: '400px' }}>
					<Text size='l' weight='semibold' style={{ marginBottom: '16px' }}>
						Подтверждение удаления
					</Text>
          <div
            style={{
              maxHeight: '200px',
              overflowY: 'auto',
              marginBottom: '20px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              padding: '12px'
            }}
          >
            <div role='radiogroup'>
              {customers.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid #f5f5f5',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedValue(String(item.id))}
                >
                  <Radio
                    checked={stringValue === String(item.id)}
                    onChange={() => setSelectedValue(String(item.id))}
                    name='customer-delete'
                    value={String(item.id)}
                    style={{ marginRight: '12px' }}
                  />
                  <div>
                    <Text size='m'>
                      {item.customerCode || 'Без кода'} -{' '}
                      {item.customerName || 'Без имени'}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
					</div>
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							gap: '12px',
							marginTop: '24px'
						}}
					>
						<Button
							label='Отмена'
							size='s'
							view='ghost'
							onClick={() => {
								setDeleteModalOpen(false)
								setSelectedValue(null)
							}}
						/>
						<Button
							label='Удалить'
							size='s'
							view='alert'
              onClick={confirmDelete}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#ff4444';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#ff4444';
              e.currentTarget.style.transform = 'scale(1)';
            }}
							disabled={!selectedValue}
						/>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default Customer
