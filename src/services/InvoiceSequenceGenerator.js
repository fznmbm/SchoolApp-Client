class InvoiceSequenceGenerator {
  constructor() {
    this.storageKey = 'invoice_sequence_counters';
    this.tempNumberKey = 'temp_invoice_number';
    this.lastUsedNumberKey = 'last_used_invoice_number';
    this.globalSequenceKey = 'global_invoice_sequence';
    this.initializeStorage();
  }

  /**
   * Initialize the sequence storage if it doesn't exist
   */
  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.lastUsedNumberKey)) {
      localStorage.setItem(this.lastUsedNumberKey, JSON.stringify({}));
    }
    if (!localStorage.getItem(this.globalSequenceKey)) {
      localStorage.setItem(this.globalSequenceKey, '0');
    }
  }

  /**
   * Get the current global sequence number
   * @returns {number} Current global sequence number
   */
  getGlobalSequence() {
    return parseInt(localStorage.getItem(this.globalSequenceKey) || '0');
  }

  /**
   * Increment and save the global sequence number
   * @returns {number} Next global sequence number
   */
  incrementGlobalSequence() {
    const nextValue = this.getGlobalSequence() + 1;
    localStorage.setItem(this.globalSequenceKey, nextValue.toString());
    return nextValue;
  }

  /**
   * Preview the next sequence number without incrementing the counter
   * @returns {string} - Two-digit sequence number (e.g., "01", "02", "10")
   */
  previewNextSequenceNumber() {
    const nextCounter = this.getGlobalSequence() + 1;
    return String(nextCounter).padStart(2, '0');
  }

  /**
   * Generate a preview invoice number that won't be committed until finalized
   * Following the format: (invoicenumber)_invoice_(routenumber)_(month&year ex-Mar25)_crown
   * @param {string} routeNumber - The route number
   * @param {string} month - Month abbreviation (optional, defaults to current month)
   * @param {string} shortYear - 2-digit year (optional, defaults to current year)
   * @param {number} fullYear - 4-digit year (optional, defaults to current year)
   * @returns {object} - Object containing invoice number parts for editing
   */
  generatePreviewInvoiceNumber(routeNumber, month = null, shortYear = null, fullYear = null) {
    // Use provided values or defaults from current date
    const now = new Date();
    const currentMonth = month || now.toLocaleString('en-US', { month: 'short' });
    const currentFullYear = fullYear || now.getFullYear();
    const currentShortYear = shortYear || String(currentFullYear).slice(-2);
    
    // Preview the next sequence number using global sequence
    const sequenceNumber = this.previewNextSequenceNumber();
    
    // Generate the preview invoice number with the format
    // (invoicenumber)_invoice_(routenumber)_(month&year)_crown
    const previewNumber = `${sequenceNumber}_invoice_${routeNumber}_${currentMonth}${currentShortYear}_crown`;
    
    // Create object with separate components for editing
    const numberComponents = {
      routeNumber,
      month: currentMonth,
      shortYear: currentShortYear,
      fullYear: currentFullYear,
      sequenceNumber
    };
    
    // Store the temporary number and details for later finalization
    const tempData = {
      invoiceNumber: previewNumber,
      ...numberComponents,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(this.tempNumberKey, JSON.stringify(tempData));
    
    return {
      fullNumber: previewNumber,
      components: numberComponents
    };
  }

   /**
   * Finalize and commit a custom invoice number with user-specified components
   * @param {object} components - The components of the invoice number
   * @returns {string} The finalized invoice number
   */
   finalizeCustomInvoiceNumber(components) {
    const { routeNumber, month, shortYear, sequenceNumber } = components;
    
    // Generate the final invoice number string
    const invoiceNumber = `${sequenceNumber}_invoice_${routeNumber}_${month}${shortYear}_crown`;
    
    // Set the global sequence to the current sequence number
    // This ensures the next number continues from this point
    this.setGlobalSequence(sequenceNumber);
    
    // Clear the temporary data
    localStorage.removeItem(this.tempNumberKey);
    
    return invoiceNumber;
  }

  /**
   * Finalize the current temporary invoice number
   * @returns {string} The finalized invoice number
   */
  finalizeInvoiceNumber() {
    const tempData = JSON.parse(localStorage.getItem(this.tempNumberKey) || 'null');
    if (!tempData) {
      throw new Error('No temporary invoice number to finalize');
    }
    
    // Use the components from the temporary data
    return this.finalizeCustomInvoiceNumber({
      routeNumber: tempData.routeNumber,
      month: tempData.month,
      shortYear: tempData.shortYear,
      sequenceNumber: tempData.sequenceNumber
    });
  }

  /**
   * Cancel the temporary invoice number without finalizing it
   */
  cancelTemporaryInvoiceNumber() {
    localStorage.removeItem(this.tempNumberKey);
  }

  /**
   * Reset all counters (useful for testing)
   */
  resetAllCounters() {
    this.saveCounters({});
    localStorage.setItem(this.lastUsedNumberKey, JSON.stringify({}));
    localStorage.setItem(this.globalSequenceKey, '0');
  }

  /**
   * Get all available months as options for the dropdown
   * @returns {Array} Array of month abbreviations
   */
  getMonthOptions() {
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

   /**
   * Set the global sequence to a specific value
   * This is used when a user manually edits a sequence number
   * @param {string|number} sequenceNumber - The sequence number to set
   * @returns {number} The updated sequence number
   */
   setGlobalSequence(sequenceNumber) {
    // Convert to number and ensure it's valid
    const numericValue = parseInt(sequenceNumber) || 0;
    
    // Only update if the new value is greater than or equal to the current one
    // This prevents going backward in the sequence
    const currentValue = this.getGlobalSequence();
    if (numericValue >= currentValue) {
      localStorage.setItem(this.globalSequenceKey, numericValue.toString());
      return numericValue;
    }
    return currentValue;
  }
}

const invoiceSequenceGenerator = new InvoiceSequenceGenerator();

window.invoiceSequenceGenerator = invoiceSequenceGenerator;

export default invoiceSequenceGenerator;