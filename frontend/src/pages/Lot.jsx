import { useEffect, useState } from 'react'
import axios from 'axios'
import { Table } from '@consta/uikit/Table';

const columns = [
  {
    title: 'Имя лота',
    accessor: 'lotName',
    width: 200,
    sortable: true,
    renderCell: (row) => row.lotName || 'Нет данных',
  },
  {
    title: 'Код клиента',
    width: 170,
    accessor: 'customerCode',
    sortable: true,
    renderCell: (row) => row.customerCode || 'Нет данных',
  },
  {
    title: 'Стоимость',
    width: 170,
    accessor: 'price',
    sortable: true,
    renderCell: (row) => row.price || 'Нет данных',
  },
  {
    title: 'Валюта',
    width: 200,
    accessor: 'currencyCode',
    sortable: true,
    renderCell: (row) => row.currencyCode || 'Нет данных',
  },
  {
    title: 'НДС',
    align: 'center',
    accessor: 'ndsRate',
    width: 150,
    withoutPadding: true,
    sortable: true,
    renderCell: (row) => (
      <div style={{
        padding: '10px 5px',
      }}>
        {row.ndsRate.endsWith('20') || row.ndsRate.endsWith('18') ?  `${row.ndsRate.slice(5, 7)}%` : 'Без НДС'}
      </div>
    ),
  },
  {
    title: 'Грузополучатель',
    align: 'center',
    accessor: 'placeDelivery',
    width: 220,
    withoutPadding: true,
    sortable: true,
    renderCell: (row) => (
      <div style={{
        padding: '10px 5px',
      }}>
        {row.placeDelivery || 'Нет данных'}
      </div>
    ),
  },
  {
    title: 'Дата доставки',
    align: 'center',
    accessor: 'dateDelivery',
    width: 100,
    withoutPadding: true,
    sortable: true,
    renderCell: (row) => (
      <div style={{
        padding: '10px 5px',
        wordBreak: 'break-all', // Перенос в любом месте
        whiteSpace: 'normal', // Разрешаем перенос строк
        overflowWrap: 'break-word', // Перенос длинных слов
      }}>
        {row.dateDelivery ? row.dateDelivery.slice(0, 10) : 'Нет данных'}
      </div>
    ),
  }
];

const Lot = () => {

  const[lots, setLots] = useState([])
  

  const getLots = async () => {
    await axios.get('http://localhost:8080/lots')
    .then(res => {
      console.log(res.data)
      setLots(res.data)
    }).catch(e => console.log(e))
  }

  useEffect(() => {
    getLots()
  }, [])

  return (
   <Table
         borderBetweenColumns
         borderBetweenRows
         stickyHeader
         columns={columns}
         rows={lots} />
  )
}

export default Lot
