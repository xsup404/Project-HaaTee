/**
 * Utility functions for generating and downloading contract PDFs
 */

/**
 * Generate PDF content from contract data
 */
export const generateContractPDF = (contractData) => {
  const {
    contractNumber = 'HAA-2024-001',
    contractType = 'สัญญาเช่า',
    propertyTitle = 'คอนโดมิเนียมชมพร',
    startDate = '1 มกราคม 2567',
    endDate = '31 ธันวาคม 2567',
    monthlyRent = '15,000',
    deposit = '45,000',
    buyerName = '',
    sellerName = '',
    price = '',
    status = 'อยู่ระหว่างสัญญา'
  } = contractData;

  // Create HTML content for PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${contractNumber}</title>
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        body {
          font-family: 'Sarabun', 'TH Sarabun New', Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #1976D2;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1976D2;
          margin: 0;
          font-size: 24px;
        }
        .contract-info {
          margin: 20px 0;
        }
        .contract-info h2 {
          color: #1976D2;
          font-size: 18px;
          margin-bottom: 10px;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          padding: 8px 0;
          border-bottom: 1px solid #E0E0E0;
        }
        .info-label {
          font-weight: bold;
          width: 200px;
        }
        .info-value {
          flex: 1;
        }
        .section {
          margin: 30px 0;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #1976D2;
          margin-bottom: 15px;
          border-left: 4px solid #1976D2;
          padding-left: 10px;
        }
        .terms {
          margin: 15px 0;
          padding: 15px;
          background: #F5F5F5;
          border-radius: 5px;
        }
        .terms ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .terms li {
          margin: 8px 0;
        }
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          width: 45%;
          text-align: center;
        }
        .signature-line {
          border-top: 1px solid #333;
          margin-top: 60px;
          padding-top: 5px;
        }
        .footer {
          margin-top: 50px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #E0E0E0;
          padding-top: 20px;
        }
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${contractType} - ${propertyTitle}</h1>
        <p>หมายเลขสัญญา: ${contractNumber}</p>
      </div>

      <div class="contract-info">
        <h2>ข้อมูลสัญญา</h2>
        <div class="info-row">
          <span class="info-label">ประเภทสัญญา:</span>
          <span class="info-value">${contractType}</span>
        </div>
        <div class="info-row">
          <span class="info-label">ทรัพย์สิน:</span>
          <span class="info-value">${propertyTitle}</span>
        </div>
        ${buyerName ? `
        <div class="info-row">
          <span class="info-label">ผู้เช่า/ผู้ซื้อ:</span>
          <span class="info-value">${buyerName}</span>
        </div>
        ` : ''}
        ${sellerName ? `
        <div class="info-row">
          <span class="info-label">ผู้ให้เช่า/ผู้ขาย:</span>
          <span class="info-value">${sellerName}</span>
        </div>
        ` : ''}
        ${startDate ? `
        <div class="info-row">
          <span class="info-label">${contractType === 'สัญญาเช่า' ? 'เริ่มต้น:' : 'วันทำสัญญา:'}</span>
          <span class="info-value">${startDate}</span>
        </div>
        ` : ''}
        ${endDate ? `
        <div class="info-row">
          <span class="info-label">${contractType === 'สัญญาเช่า' ? 'สิ้นสุด:' : 'วันโอนกรรมสิทธิ์:'}</span>
          <span class="info-value">${endDate}</span>
        </div>
        ` : ''}
        ${monthlyRent ? `
        <div class="info-row">
          <span class="info-label">ค่าเช่ารายเดือน:</span>
          <span class="info-value">${monthlyRent} บาท</span>
        </div>
        ` : ''}
        ${deposit ? `
        <div class="info-row">
          <span class="info-label">เงินมัดจำ:</span>
          <span class="info-value">${deposit} บาท</span>
        </div>
        ` : ''}
        ${price ? `
        <div class="info-row">
          <span class="info-label">ราคาขาย:</span>
          <span class="info-value">${price} บาท</span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">สถานะ:</span>
          <span class="info-value">${status}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">เงื่อนไขและข้อตกลง</div>
        <div class="terms">
          <ol>
            <li>คู่สัญญาทั้งสองฝ่ายตกลงทำสัญญา${contractType === 'สัญญาเช่า' ? 'เช่า' : 'ซื้อขาย'}ทรัพย์สินตามรายละเอียดข้างต้น</li>
            <li>${contractType === 'สัญญาเช่า' ? 'ผู้เช่าต้องชำระค่าเช่าตามกำหนดเวลา และดูแลรักษาทรัพย์สินให้อยู่ในสภาพดี' : 'ผู้ซื้อตกลงชำระเงินตามเงื่อนไขที่กำหนด และผู้ขายตกลงโอนกรรมสิทธิ์ให้ตามกฎหมาย'}</li>
            <li>สัญญานี้มีผลบังคับใช้ตามกฎหมายไทย</li>
            <li>กรณีเกิดข้อพิพาท ให้ตกลงกันโดยสันติวิธีก่อน หากไม่สามารถตกลงกันได้ ให้ยื่นฟ้องต่อศาลที่มีอำนาจ</li>
            <li>สัญญานี้ทำขึ้นเป็นภาษาไทยและภาษาอังกฤษ หากมีความแตกต่างกัน ให้ใช้ภาษาไทยเป็นหลัก</li>
          </ol>
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-line">
            <strong>${buyerName || 'ผู้เช่า/ผู้ซื้อ'}</strong>
          </div>
        </div>
        <div class="signature-box">
          <div class="signature-line">
            <strong>${sellerName || 'ผู้ให้เช่า/ผู้ขาย'}</strong>
          </div>
        </div>
      </div>

      <div class="footer">
        <p>เอกสารนี้สร้างโดยระบบ HaaTee E-Contract</p>
        <p>วันที่สร้าง: ${new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

/**
 * Open contract PDF in new window for viewing
 */
export const viewContractPDF = (contractData) => {
  const htmlContent = generateContractPDF(contractData);
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then show print dialog
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
};

/**
 * Download contract as PDF
 */
export const downloadContractPDF = (contractData) => {
  const htmlContent = generateContractPDF(contractData);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary iframe to print
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  iframe.onload = () => {
    setTimeout(() => {
      iframe.contentWindow.print();
      
      // Clean up after a delay
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 1000);
    }, 250);
  };
  
  iframe.src = url;
  
  // Alternative: Use browser's print dialog
  // This will allow user to save as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  }
};

