import React, { useCallback } from 'react';
import { FieldArray } from 'formik';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Input from '@components/common/input/Input';

const InvoiceItemsTable = ({ values, handleChange, setFieldValue }) => {
  
  const recalculateTotalsFromItems = useCallback((items) => {
    let newNetTotal = 0;
    items.forEach((item) => {
      newNetTotal += parseFloat(item.amount) || 0;
    });
    setFieldValue('netTotal', newNetTotal.toFixed(2));
    const newVatAmount = (newNetTotal * (parseFloat(values.vatRate) || 0) / 100).toFixed(2);
    setFieldValue('vatAmount', newVatAmount);
    setFieldValue('totalAmount', (newNetTotal + parseFloat(newVatAmount)).toFixed(2));
  }, [values.vatRate, setFieldValue]);
  
  const handleQuantityChange = useCallback((index, e) => {
    const qty = parseFloat(e.target.value) || 0;
    setFieldValue(`items.${index}.quantity`, qty.toFixed(1));
    const unitPrice = parseFloat(values.items[index].unitPrice) || 0;
    const newAmount = (qty * unitPrice).toFixed(2);
    setFieldValue(`items.${index}.amount`, newAmount);
    // Build a current items array including the just-updated amount for accurate totals
    const updatedItems = values.items.map((it, i) => i === index ? { ...it, amount: newAmount } : it);
    recalculateTotalsFromItems(updatedItems);
  }, [values.items, setFieldValue, recalculateTotalsFromItems]);
  
  const handleUnitPriceChange = useCallback((index, e) => {
    const price = Math.round(parseFloat(e.target.value) || 0);
    setFieldValue(`items.${index}.unitPrice`, price.toFixed(0));
    const qty = parseFloat(values.items[index].quantity) || 0;
    const newAmount = (qty * price).toFixed(2);
    setFieldValue(`items.${index}.amount`, newAmount);
    const updatedItems = values.items.map((it, i) => i === index ? { ...it, amount: newAmount } : it);
    recalculateTotalsFromItems(updatedItems);
  }, [values.items, setFieldValue, recalculateTotalsFromItems]);
  
  const handleRemoveItem = useCallback((index, remove) => {
    remove(index);
    const updatedItems = values.items.filter((_, i) => i !== index);
    recalculateTotalsFromItems(updatedItems);
  }, [values.items, recalculateTotalsFromItems]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-4 text-gray-800 dark:text-gray-200">Invoice Items</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              <th className="px-4 py-2 border-b border-r border-gray-200 dark:border-gray-700 text-left">Description</th>
              <th className="px-4 py-2 border-b border-r border-gray-200 dark:border-gray-700 text-left">Quantity</th>
              <th className="px-4 py-2 border-b border-r border-gray-200 dark:border-gray-700 text-left">Unit Price</th>
              <th className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-left">Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-800 dark:text-gray-200">
            <FieldArray name="items">
              {({ remove, push }) => (
                <>
                  {values.items.map((item, index) => (
                    <tr key={index} className="transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-2 border-b border-r border-gray-200 dark:border-gray-700">
                        <Input
                          name={`items.${index}.description`}
                          value={item.description}
                          onChange={handleChange}
                          aria-label={`Item ${index + 1} description`}
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-r border-gray-200 dark:border-gray-700">
                        <Input
                          name={`items.${index}.quantity`}
                          type="number"
                          step="0.5"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(index, e)}
                          aria-label={`Item ${index + 1} quantity`}
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-r border-gray-200 dark:border-gray-700">
                        <Input
                          name={`items.${index}.unitPrice`}
                          type="number"
                          step="1"
                          value={item.unitPrice}
                          onChange={(e) => handleUnitPriceChange(index, e)}
                          aria-label={`Item ${index + 1} unit price`}
                        />
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex">
                        <Input
                          name={`items.${index}.amount`}
                          value={item.amount}
                          readOnly
                          className="flex-grow bg-gray-50 dark:bg-gray-700"
                          aria-label={`Item ${index + 1} total amount`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index, remove)}
                          className="ml-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          aria-label={`Remove item ${index + 1}`}
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="4" className="px-4 py-2">
                      <button
                        type="button"
                        onClick={() => push({
                          description: '',
                          quantity: '1.0',
                          unitPrice: '0.00',
                          amount: '0.00'
                        })}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm transition-colors duration-200"
                        aria-label="Add new invoice item"
                      >
                        + Add item
                      </button>
                    </td>
                  </tr>
                </>
              )}
            </FieldArray>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceItemsTable;