import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table } from '@consta/uikit/Table'
import { Button } from '@consta/uikit/Button'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { Radio } from '@consta/uikit/Radio'
import { IconAdd } from '@consta/icons/IconAdd'
import { IconTrash } from '@consta/icons/IconTrash'
import { IconEdit } from '@consta/icons/IconEdit'

const Customer = () => {
	const columns = [
		{
			title: 'Код клиента*',
			accessor: 'customerCode',
			width: 100,
			sortable: true,
			renderCell: row => row.customerCode || 'Нет данных'
		},
		{
			title: 'ФИО*',
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
			title: 'Вышестоящий клиент*',
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

  const initialFormData = {
    customerCode: '',
    customerName: '',
    customerInn: '',
    customerKpp: '',
    customerLegalAddress: '',
    customerPostalAddress: '',
    customerEmail: '',
    customerCodeMain: '',
    isOrganization: '',
    isPerson: '',
  };

	const [customers, setCustomers] = useState([])
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [deleteModalOpen, setDeleteModalOpen] = useState(false)
	const [selectedValue, setSelectedValue] = useState(null)

	const handleDeleteClick = row => {
		setSelectedValue(row.id)
		setDeleteModalOpen(true)
	}

	const deleteCustomer = async id => {
		await axios
			.delete(`http://localhost:8080/customers/${id}`)
			.then(_ => getCustomers())
			.catch(e => console.log(e))
	}

	const confirmDelete = async () => {
		deleteCustomer(selectedValue)
		setDeleteModalOpen(false)
		setSelectedValue(null)
	}

  {/* создание */}

	const confirmCreate = async () => {
    if (!formData.customerCode || !formData.customerCodeMain || !formData.customerName) {
      alert('Заполните все обязательные поля (*)');
      return;
    }
  
    if (errors && Object.keys(errors).length > 0) {
      Object.values(errors).forEach(error => {
        if (error) alert(error);
      });
      return;
    }
  
    setFormData(prev => {
      const newIsOrganization = prev.isOrganization === "да";
      const newIsPerson = prev.isPerson === "да";
      
      return {
        ...prev,
        isOrganization: newIsOrganization,
        isPerson: newIsPerson
      };
    });

  const dataToSend = {
    ...formData,
    isOrganization: formData.isOrganization === "да",
    isPerson: formData.isPerson === "да"
  };

  try {
    await axios.post('http://localhost:8080/customers', dataToSend).then((_ => getCustomers())).catch(e => console.log(e));
    
    // Только после успешного запроса обновляем локальное состояние
    setFormData(prev => ({
      ...prev,
      isOrganization: prev.isOrganization === "да",
      isPerson: prev.isPerson === "да"
    }));
    
    setCreateModalOpen(false);
    
    setFormData(initialFormData);

    
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Ошибка при создании контрагента');
  }
}
  const typeTextField = (title) => {
    if(title == 'ИНН' || title == 'КПП') {
      return 'number'
    } else if(title == 'Электронная почта') {
      return 'email'
    } else {
      return 'text'
    }
  }

  const handleFieldChange = (fieldName, value) => {
        
    let processedValue = value;
    let error = '';

    if (fieldName === 'customerInn') {
      if (processedValue && processedValue.length !== 10 && processedValue.length !== 12) {
        error = 'ИНН должен содержать 10 или 12 цифр';
      }
    }
    else if (fieldName === 'customerKpp') {
      if (processedValue && processedValue.length !== 9) {
        error = 'КПП должен содержать 9 цифр';
      }
    } else if(fieldName === 'isOrganization' || fieldName == 'isPerson') {
      if (processedValue != 'да' && processedValue !== 'нет') {
        error = 'Ответьте "да" или "нет"';
      }
    } else {
      processedValue = value;
    }
    setFormData(prev => ({ ...prev, [fieldName]: processedValue }));

    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
    } else if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

	const stringValue = selectedValue ? String(selectedValue) : null

	const getCustomers = async () => {
		await axios
			.get('http://localhost:8080/customers')
			.then(res => {
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
				<Button
					label='Создать'
					iconLeft={IconAdd}
					onlyIcon
					onClick={() => setCreateModalOpen(prev => !prev)}
				/>
				<Button label='Изменить' iconLeft={IconEdit} onlyIcon />
				<Button label='Удалить' iconLeft={IconTrash} onlyIcon onClick={handleDeleteClick} />
			</div>
			<Table
				borderBetweenColumns
				borderBetweenRows
				stickyHeader
				columns={columns}
				rows={customers}
			/>

			{/* модальное окно для удаления */}
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
							onMouseEnter={e => {
								e.currentTarget.style.backgroundColor = '#ff4444'
								e.currentTarget.style.color = 'white'
								e.currentTarget.style.transform = 'scale(1.1)'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.backgroundColor = 'transparent'
								e.currentTarget.style.color = '#ff4444'
								e.currentTarget.style.transform = 'scale(1)'
							}}
							disabled={!selectedValue}
						/>
					</div>
				</div>
			</Modal>

			{/* модальное окно для создания */}
			<Modal
				isOpen={createModalOpen}
				hasOverlay
				onClickOutside={() => setCreateModalOpen(false)}
				onEsc={() => setCreateModalOpen(false)}
			>
				<div style={{ padding: '24px 20px 12px 20px', minWidth: '400px' }}>
					<Text size='l' weight='semibold' style={{ marginBottom: '16px' }}>
						Cоздание новой записи
					</Text>
				</div>

        <div style={{padding: '0 20px', maxWidth: '400px'}}>
          {columns.map(item => 
            (<TextField key={item.accessor} 
              value={formData.hasOwnProperty(item.accessor) ? formData[item.accessor] : ''} 
              onChange={(value) => handleFieldChange(item.accessor, value)} 
              label={item.accessor == 'isOrganization' || item.accessor == 'isPerson' ? `${item.title} (ответьте да или нет)` : item.title}
              status={errors[item.accessor] ? 'alert' : undefined}
              type={typeTextField(item.title)} 
              size="s" />
            )
          )}
        </div>

				<div
					style={{
						display: 'flex',
						justifyContent: 'flex-end',
						gap: '12px',
						marginTop: '24px',
            paddingRight: '20px',
            paddingBottom: '20px'
					}}
				>
					<Button
						label='Отмена'
						size='s'
						view='ghost'
						onClick={() => {
							setCreateModalOpen(false)
              setFormData(initialFormData)
              setErrors({})
						}}
					/>
					<Button
						label='Создать'
						size='s'
						view='alert'
						onClick={confirmCreate}
						onMouseEnter={e => {
							e.currentTarget.style.backgroundColor = '#0091ff'
							e.currentTarget.style.color = 'white'
							e.currentTarget.style.transform = 'scale(1.1)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.backgroundColor = 'transparent'
							e.currentTarget.style.color = '#0091ff'
							e.currentTarget.style.transform = 'scale(1)'
						}}
						//disabled={!selectedValue}
					/>
				</div>
			</Modal>
		</>
	)
}

export default Customer
