
import React from 'react';
import ViewPayslipButton from './ViewPayslipButton';
import EmailPayslipButton from './EmailPayslipButton';
import DownloadPayslipButton from './DownloadPayslipButton';

const PayslipActionButtons = ({ record, formatCurrency }) => {
  return (
    <div className="flex space-x-1">
      <ViewPayslipButton record={record} formatCurrency={formatCurrency} />
      <EmailPayslipButton record={record} formatCurrency={formatCurrency} />
      <DownloadPayslipButton record={record} formatCurrency={formatCurrency} />
    </div>
  );
};

export default PayslipActionButtons;
