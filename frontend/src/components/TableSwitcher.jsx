import React, { useState, useEffect } from 'react';
import { Tabs } from '@consta/uikit/Tabs';
import { useNavigate, useLocation } from 'react-router-dom';

const TableSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Простой массив табов
  const tabs = [
    { id: 'customers', label: 'Клиенты' },
    { id: 'lots', label: 'Лоты' },
  ];

  // Определяем активный таб
  const getActiveTabId = () => {
    const path = location.pathname;
    if (path.includes('lot')) return 'lots';
    return 'customers';
  };

  const [activeTabId, setActiveTabId] = useState(getActiveTabId());

  // Обновляем при изменении URL
  useEffect(() => {
    setActiveTabId(getActiveTabId());
  }, [location.pathname]);

  // Находим активный таб
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

  // Обработчик клика
  const handleChange = (tab) => {
    if (!tab || !tab.id) return;
    
    if (tab.id === 'customers') {
      navigate('/customer');
    } else {
      navigate('/lot');
    }
  };

  return (
    <Tabs
      value={activeTab}
      onChange={(tab) => handleChange(tab)}
      items={tabs}
      getItemLabel={(item) => item.label}
      size="l"
    />
  );
};

export default TableSwitcher;