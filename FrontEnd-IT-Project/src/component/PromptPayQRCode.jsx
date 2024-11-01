// PromptPayQRCode.js
import React from 'react';

const PromptPayQRCode = ({ phoneNumber, amount }) => {
  // URL สำหรับสร้าง QR Code จาก PromptPay.io
  const qrCodeUrl = `https://promptpay.io/${phoneNumber}/${amount}.png`;

  return (
    <div className="text-center">
      <h2>PromptPay QR Code</h2>
      <img src={qrCodeUrl} alt="PromptPay QR Code" width="200" height="200" />
      <p>Amount to Pay: ฿{amount}</p>
    </div>
  );
};

export default PromptPayQRCode;
