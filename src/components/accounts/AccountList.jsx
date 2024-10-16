import React from 'react';
import AccountItem from './AccountItem';

const AccountList = ({ accounts, setAccounts }) => {
  const handleRemoveAccount = (index) => {
    if (accounts[index].title !== "System Administrator (SysAdmin)") {
      const newAccounts = accounts.filter((_, i) => i !== index);
      setAccounts(newAccounts);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Account List</h2>
      {accounts.map((account, index) => (
        <AccountItem
          key={index}
          account={account}
          onRemove={() => handleRemoveAccount(index)}
          isSystemAdmin={account.title === "System Administrator (SysAdmin)"}
        />
      ))}
    </div>
  );
};

export default AccountList;