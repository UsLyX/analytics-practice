import React from 'react';
import { Outlet } from 'react-router-dom';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Card } from '@consta/uikit/Card';
import TableSwitcher from './components/TableSwitcher';

const Main = () => {
  return (
    <Theme preset={presetGpnDefault}>
      <div style={{ 
        padding: '20px',
        maxWidth: '1440px',
        margin: '0 auto', 
        boxSizing: 'border-box'
      }}>
        <Card 
          verticalSpace="l" 
          horizontalSpace="l"
          shadow
          style={{ marginBottom: '20px' }}
        >
          <TableSwitcher />
        </Card>

        <Card 
          verticalSpace="l" 
          horizontalSpace="l"
          shadow
        >

          <Outlet />
        </Card>
      </div>
    </Theme>
  );
};

export default Main;