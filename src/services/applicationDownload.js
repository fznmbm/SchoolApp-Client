// Lightweight renderer to open an application in a printable window

export const renderApplicationInNewWindow = (application) => {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Please allow popups to view the application');
    return;
  }

  const formatDate = (d) => {
    if (!d) return '-';
    try { return new Date(d).toLocaleDateString(); } catch { return '-'; }
  };

  const yesNo = (v) => (v ? 'Yes' : 'No');

  const docUrl = application?.workPermitDetails?.document || '';

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Application - ${application.fullName || ''}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111827; }
    .container{ max-width: 900px; margin: 24px auto; padding: 0 16px; }
    h1{ font-size: 22px; margin: 0 0 12px; }
    h2{ font-size: 16px; margin: 24px 0 8px; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; }
    .grid{ display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px 16px; }
    .row{ display:flex; gap:8px; }
    .label{ width: 220px; color:#6b7280; }
    .value{ flex:1; font-weight:600; }
    .muted{ color:#6b7280; }
    .section{ margin-bottom: 16px; }
    .btns{ display:flex; gap:12px; margin: 16px 0; justify-content:center; }
    a.button, button.button{ display:inline-block; padding:10px 16px; border:1px solid #e5e7eb; border-radius:8px; text-decoration:none; color:#111827; background:#f9fafb; }
    /* Force green primary style at all times */
    a.button.primary, button.button.primary{ background:#22c55e; color:#fff !important; border-color:#16a34a; }
    a.button.primary:hover, a.button.primary:visited, a.button.primary:active, a.button.primary:focus,
    button.button.primary:hover, button.button.primary:active, button.button.primary:focus{ background:#22c55e; color:#fff !important; }
    .footer{ margin-top:24px; color:#6b7280; font-size:12px; }
  </style>
  <script>
    function doPrint(){ window.print(); }
  </script>
</head>
<body>
  <div class="container">
    <h1>Application Details</h1>
    <div class="muted">Status: ${application.status || '-'} • Submitted: ${formatDate(application.submittedAt)}</div>
    <div class="btns">
      <a class="button primary" href="#" onclick="doPrint(); return false;">Print Application</a>
      ${docUrl ? `<a class="button" href="${docUrl}" target="_blank">Open Work Permit</a>` : ''}
    </div>

    <h2>Personal Information</h2>
    <div class="section">
      <div class="row"><div class="label">Full Name</div><div class="value">${application.fullName || '-'}</div></div>
      <div class="row"><div class="label">Email</div><div class="value">${application.email || '-'}</div></div>
      <div class="row"><div class="label">Phone Number</div><div class="value">${application.phoneNumber || '-'}</div></div>
      <div class="row"><div class="label">Position</div><div class="value">${application.position || '-'}</div></div>
      <div class="row"><div class="label">Current Address</div><div class="value">${application.currentAddress || '-'}</div></div>
      <div class="row"><div class="label">Previous Address</div><div class="value">${application.previousAddress || '-'}</div></div>
      <div class="row"><div class="label">National Insurance No.</div><div class="value">${application.nationalInsuranceNumber || '-'}</div></div>
      <div class="row"><div class="label">Nationality</div><div class="value">${application.nationality || '-'}</div></div>
    </div>

    <h2>Work Eligibility</h2>
    <div class="section">
      <div class="row"><div class="label">UK Driving License</div><div class="value">${yesNo(application.hasUKDrivingLicense)}</div></div>
      <div class="row"><div class="label">Requires Work Permit</div><div class="value">${yesNo(application.requiresWorkPermit)}</div></div>
      <div class="row"><div class="label">Work Permit Number</div><div class="value">${application?.workPermitDetails?.permitNumber || '-'}</div></div>
      ${docUrl ? `<div class="row"><div class="label">Work Permit Document</div><div class="value"><a href="${docUrl}" target="_blank">Open</a></div></div>` : ''}
    </div>

    <h2>DBS Information</h2>
    <div class="section">
      <div class="row"><div class="label">Registered with Update Service</div><div class="value">${yesNo(application?.dbsInfo?.isRegisteredWithUpdateService)}</div></div>
      ${application?.dbsInfo?.isRegisteredWithUpdateService ? `
        <div class="row"><div class="label">Name</div><div class="value">${application?.dbsInfo?.name || '-'}</div></div>
        <div class="row"><div class="label">Date of Birth</div><div class="value">${formatDate(application?.dbsInfo?.dateOfBirth)}</div></div>
        <div class="row"><div class="label">Certificate Number</div><div class="value">${application?.dbsInfo?.certificateNumber || '-'}</div></div>
        <div class="row"><div class="label">Update Service ID</div><div class="value">${application?.dbsInfo?.updateServiceId || '-'}</div></div>
      ` : ''}
    </div>

    <h2>References</h2>
    <div class="section">
      ${(application.references || []).map((r, i) => `
        <div class="row"><div class="label">Reference ${i+1}</div><div class="value">${r.name || '-'} — ${r.relationship || '-'} — ${r.phone || '-'}</div></div>
        <div class="row"><div class="label"></div><div class="value muted">${r.address || ''} ${r.email ? ' • ' + r.email : ''}</div></div>
      `).join('')}
    </div>

    <h2>Convictions</h2>
    <div class="section">
      <div class="row"><div class="label">Has Convictions</div><div class="value">${yesNo(application.hasConvictions)}</div></div>
      ${application.hasConvictions ? `<div class="row"><div class="label">Details</div><div class="value">${application.convictionDetails || '-'}</div></div>` : ''}
    </div>

    <h2>Declaration</h2>
    <div class="section">
      <div class="row"><div class="label">Agreed To Terms</div><div class="value">${yesNo(application?.declaration?.agreedToTerms)}</div></div>
      <div class="row"><div class="label">Full Name</div><div class="value">${application?.declaration?.fullName || '-'}</div></div>
      <div class="row"><div class="label">Date</div><div class="value">${formatDate(application?.declaration?.date)}</div></div>
    </div>

    

    <div class="footer">Generated from Crown Cars Application</div>
  </div>
 </body>
</html>`;

  win.document.write(html);
  win.document.close();
};


