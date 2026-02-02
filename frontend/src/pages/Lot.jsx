import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table } from '@consta/uikit/Table'
import { Button } from '@consta/uikit/Button'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { Radio } from '@consta/uikit/Radio'
import { Select } from '@consta/uikit/Select'
import { TextField } from '@consta/uikit/TextField'
import { IconAdd } from '@consta/icons/IconAdd'
import { IconTrash } from '@consta/icons/IconTrash'
import { IconEdit } from '@consta/icons/IconEdit'

const Lot = () => {
	const columns = [
		{
			title: 'Имя лота',
			accessor: 'lotName',
			width: 200,
			sortable: true,
			renderCell: row => row.lotName || 'Нет данных'
		},
		{
			title: 'Код клиента',
			width: 170,
			accessor: 'customerCode',
			sortable: true,
			renderCell: row => row.customerCode || 'Нет данных'
		},
		{
			title: 'Стоимость',
			width: 170,
			accessor: 'price',
			sortable: true,
			renderCell: row => row.price || 'Нет данных'
		},
		{
			title: 'Валюта',
			width: 200,
			accessor: 'currencyCode',
			sortable: true,
			renderCell: row => row.currencyCode || 'Нет данных'
		},
		{
			title: 'НДС',
			align: 'center',
			accessor: 'ndsRate',
			width: 150,
			withoutPadding: true,
			sortable: true,
			renderCell: row => (
				<div
					style={{
						padding: '10px 5px'
					}}
				>
					{row.ndsRate.endsWith('20') || row.ndsRate.endsWith('18')
						? `${row.ndsRate.slice(5, 7)}%`
						: 'Без НДС'}
				</div>
			)
		},
		{
			title: 'Грузополучатель',
			align: 'center',
			accessor: 'placeDelivery',
			width: 220,
			withoutPadding: true,
			sortable: true,
			renderCell: row => (
				<div
					style={{
						padding: '10px 5px'
					}}
				>
					{row.placeDelivery || 'Нет данных'}
				</div>
			)
		},
		{
			title: 'Дата доставки',
			align: 'center',
			accessor: 'dateDelivery',
			width: 100,
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
					{row.dateDelivery ? row.dateDelivery.slice(0, 10) : 'Нет данных'}
				</div>
			)
		}
	]

	const initialFormData = {
		lotName: '',
		customerCode: '',
		price: '',
		currencyCode: '',
		ndsRate: '',
		placeDelivery: '',
		dateDelivery: ''
	}

	const [customers, setCustomers] = useState([]) // массив клиентов
	const [formData, setFormData] = useState(initialFormData) // форма для создания лота
	const [selectedValue, setSelectedValue] = useState(null)
	const [lot, setLot] = useState({})
	const [updateLot, setUpdateLot] = useState({})

	const [createModalOpen, setCreateModalOpen] = useState(false) // модалка создания
	const [deleteModalOpen, setDeleteModalOpen] = useState(false) // модалка удалиения
	const [updateModalOpen, setUpdateModalOpen] = useState(false) // модалка удалиения
	const [selectedId, setSelectedId] = useState(null)

	const [lots, setLots] = useState([])

	const stringValue = selectedValue ? String(selectedValue) : null

	//создание

	const confirmCreate = async () => {
		console.log(formData)
		try {
			await axios
				.post('http://localhost:8080/lots', formData)
				.then(_ => getLots())
				.catch(e => console.log(e))

			setCreateModalOpen(false)

			setFormData(initialFormData)
		} catch (error) {
			console.error('Ошибка:', error)
			alert('Ошибка при создании контрагента')
		}
	}

	const typeTextField = title => {
		if (title == 'Стоимость') {
			return 'number'
		} else {
			return 'text'
		}
	}

	const handleFieldChange = (fieldName, value) => {
		let processedValue = value
		let error = ''

		if (fieldName === 'customerInn') {
			if (processedValue && processedValue.length !== 10 && processedValue.length !== 12) {
				error = 'ИНН должен содержать 10 или 12 цифр'
			}
		} else if (fieldName === 'customerKpp') {
			if (processedValue && processedValue.length !== 9) {
				error = 'КПП должен содержать 9 цифр'
			}
		} else if (fieldName === 'isOrganization' || fieldName == 'isPerson') {
			if (processedValue != 'да' && processedValue !== 'нет') {
				error = 'Ответьте "да" или "нет"'
			}
		} else {
			processedValue = value
		}
		setFormData(prev => ({ ...prev, [fieldName]: processedValue }))
	}

	// удаление
	{
		/* функция для удаления клиента */
	}
	const deleteCustomer = async id => {
		await axios
			.delete(`http://localhost:8080/lots/${id}`)
			.then(_ => getLots())
			.catch(e => console.log(e))
	}

	{
		/* функция для подтверждения удаления */
	}

	const confirmDelete = async () => {
		deleteCustomer(selectedValue)
		setDeleteModalOpen(false)
		setSelectedValue(null)
	}

	{
		/* обновление */
	}

	const updateChange = (fieldName, value) => {
		let processedValue = value
		let error = ''

		if (fieldName === 'customerInn') {
			if (processedValue && processedValue.length !== 10 && processedValue.length !== 12) {
				error = 'ИНН должен содержать 10 или 12 цифр'
			}
		} else if (fieldName === 'customerKpp') {
			if (processedValue && processedValue.length !== 9) {
				error = 'КПП должен содержать 9 цифр'
			}
		} else if (fieldName === 'isOrganization' || fieldName == 'isPerson') {
			if (processedValue != 'да' && processedValue !== 'нет') {
				error = 'Ответьте "да" или "нет"'
			}
		} else {
			processedValue = value
		}
		setUpdateLot(prev => ({ ...prev, [fieldName]: processedValue }))
	}

	{
		/* после нажатия кнопки обновить */
	}
	const confirmUpdate = async () => {
		// сравнение объектов
		const changedProperties = Object.keys(updateLot).reduce((acc, key) => {
			if (updateLot[key] !== lot[key]) {
				acc[key] = updateLot[key]
			}
			return acc
		}, {})
		await axios
			.patch(`http://localhost:8080/lots/${lot.id}`, changedProperties)
			.then(_ => getLots())
			.catch(e => console.log(e))

		setSelectedId(null)
		setLot({})
		setUpdateLot({})
	}

	{
		/* поиск лота из селекта */
	}
	const findLot = selectedClient => {
		const findLot =
			selectedClient && lots.find(customer => customer.id === selectedClient.value)

		if (findLot) {
			const customerCopy = { ...findLot }

			setLot(customerCopy)
			setUpdateLot(customerCopy)
		} else {
			setLot(null)
		}
	}

	// полчение клиентов

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

	// полчение лотов

	const getLots = async () => {
		await axios
			.get('http://localhost:8080/lots')
			.then(res => {
				setLots(res.data)
			})
			.catch(e => console.log(e))
	}

	useEffect(() => {
		getLots()
	}, [])

	useEffect(() => {
		findLot(selectedId)
	}, [selectedId])

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
				<Button
					label='Изменить'
					iconLeft={IconEdit}
					onlyIcon
					onClick={() => setUpdateModalOpen(prev => !prev)}
				/>
				<Button
					label='Удалить'
					iconLeft={IconTrash}
					onlyIcon
					onClick={() => setDeleteModalOpen(prev => !prev)}
				/>
			</div>

			<Table
				borderBetweenColumns
				borderBetweenRows
				stickyHeader
				columns={columns}
				rows={lots}
			/>

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

				<div style={{ padding: '0 20px', maxWidth: '400px' }}>
					{columns.map(item =>
						item.accessor == 'customerCode' || item.accessor == 'ndsRate' ? (
							<>
								<Text style={{ margin: '5px 0 15px 0', color: '#00203399' }}>
									{item.accessor == 'customerCode' ? 'Код контрагента' : 'НДС'}
								</Text>
								<Select
									key={item.accessor}
									style={{ margin: '0' }}
									items={
										item.accessor == 'customerCode'
											? customers.map(customer => ({
													label: customer.customerCode,
													value: customer.id
												}))
											: [
													{ label: 'без НДС', value: 'WITHOUT_NDS' },
													{ label: '18%', value: 'RATE_18' },
													{ label: '20%', value: 'RATE_20' }
												]
									}
									onChange={value =>
										item.accessor == 'customerCode'
											? setFormData(prev => ({
													...prev,
													customerCode: value.label
												}))
											: setFormData(prev => ({
													...prev,
													ndsRate: value.value
												}))
									}
									value={
										item.accessor == 'customerCode'
											? { label: formData.customerCode }
											: { label: formData.ndsRate }
									}
									placeholder={{ label: item.title }}
								/>
							</>
						) : item.accessor == 'currencyCode' ? (
							<>
								<Text style={{ margin: '5px 0 15px 0', color: '#00203399' }}>
									Валюта
								</Text>
								<Select
									style={{ margin: '0' }}
									items={[
										{ label: 'Рубли', value: 'RUB' },
										{ label: 'Доллар', value: 'USD' },
										{ label: 'Евро', value: 'EUR' }
									]}
									onChange={value =>
										setFormData(prev => ({
											...prev,
											currencyCode: value.value
										}))
									}
									value={{ label: formData.currencyCode }}
									placeholder='Валюта'
								/>
							</>
						) : (
							<TextField
								key={item.accessor}
								value={
									formData.hasOwnProperty(item.accessor)
										? formData[item.accessor]
										: ''
								}
								onChange={value => handleFieldChange(item.accessor, value)}
								label={item.title}
								type={typeTextField(item.title)}
								size='m'
							/>
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
					/>
				</div>
			</Modal>

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
							{lots.map(item => (
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
										key={item.id}
										checked={stringValue === String(item.id)}
										onChange={() => setSelectedValue(String(item.id))}
										name='customer-delete'
										value={String(item.id)}
										style={{ marginRight: '12px' }}
									/>
									<div>
										<Text size='m'>
											{item.lotName || 'Без кода'} -{' '}
											{item.customerCode || 'Без имени'}
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

			{/* модальное окно для обновления */}
			<Modal
				isOpen={updateModalOpen}
				hasOverlay
				onClickOutside={() => setUpdateModalOpen(false)}
				onEsc={() => setUpdateModalOpen(false)}
			>
				<div style={{ padding: '24px 20px 12px 20px', minWidth: '400px' }}>
					<Text size='l' weight='semibold' style={{ marginBottom: '16px' }}>
						Обновление клиента
					</Text>
				</div>

				{/* Заголовок */}
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'space-between',
						justifyContent: 'center',
						gap: '10px',
						marginBottom: '20px',
						padding: '0 20px 12px 20px'
					}}
				>
					<Select
						items={lots.map(lot => ({
							label: lot.lotName,
							value: lot.id
						}))}
						onChange={value => setSelectedId(value)}
						value={selectedId}
						placeholder='Выберите лот для редактирования'
					/>
				</div>

				<div style={{ padding: '0 20px', maxWidth: '400px' }}>
					{columns.map(item =>
						item.accessor == 'currencyCode' || item.accessor == 'ndsRate' ? (
							<>
								<Text style={{ margin: '5px 0 15px 0', color: '#00203399' }}>
									{item.accessor == 'currencyCode' ? 'Валюта' : 'НДС'}
								</Text>
								<Select
									key={item.accessor}
									style={{ margin: '0' }}
									items={
										item.accessor == 'currencyCode'
											? [
                          { label: 'Рубли', value: 'RUB' },
                          { label: 'Доллар', value: 'USD' },
                          { label: 'Евро', value: 'EUR' }
                        ]
											: [
													{ label: 'без НДС', value: 'WITHOUT_NDS' },
													{ label: '18%', value: 'RATE_18' },
													{ label: '20%', value: 'RATE_20' }
												]
									}
									onChange={value =>
										item.accessor == 'currencyCode'
											? setUpdateLot(prev => ({
													...prev,
													currencyCode: value.value
												}))
											: setUpdateLot(prev => ({
													...prev,
													ndsRate: value.label
												}))
									}
									value={
										item.accessor == 'currencyCode'
											? { label: updateLot.currencyCode }
											: { label: updateLot.ndsRate }
									}
									placeholder={{ label: item.title }}
								/>
							</>
						) : item.accessor != 'customerCode' ? (
							<TextField
								key={item.accessor}
								value={(updateLot && updateLot[item.accessor]) || ''}
								onChange={value => updateChange(item.accessor, value)}
								label={item.title}
								type={typeTextField(item.title)}
								size='m'
							/>
						) : (
							<></>
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
							setUpdateModalOpen(false)
							setFormData(initialFormData)
              setLot({})
              setUpdateLot({})
              setSelectedId(null)
						}}
					/>
					<Button
						label='Обновить'
						size='s'
						view='alert'
						onClick={confirmUpdate}
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
					/>
				</div>
			</Modal>
		</>
	)
}

export default Lot
