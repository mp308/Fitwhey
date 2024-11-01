import React from 'react';
import walk from "../assets/images/Banner/People_Drinking_Whey_Protein.jpg"

function CoBannerHome() {
  return (
    <div className="flex flex-col md:flex-row items-center bg-white p-6 md:p-12 rounded-lg  max-w-4xl mx-auto">
      {/* Left Image Section */}
      <div className="w-full md:w-1/2">
        <img
          src={walk} // Replace with your image path
          alt="Fitness and Health Products"
          className="rounded-lg w-full h-auto"
        />
      </div>
      
      {/* Right Text Section */}
      <div className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-6">
        <h2 className="text-red-600 font-bold text-xl mb-4 font-prompt">WHY CHOOSE US</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start font-prompt">
            <span className="text-red-600 font-bold mr-2">—</span> ในเรื่องคุณภาพและประสิทธิภาพ เราคัดสรรวัตถุดิบชั้นเลิศ
          </li>
          <li className="flex items-start font-prompt">
            <span className="text-red-600 font-bold mr-2">—</span> เราเข้าใจถึงความสำคัญของลูกค้า เราให้การสนับสนุนที่รวดเร็ว
          </li>
          <li className="flex items-start font-prompt">
            <span className="text-red-600 font-bold mr-2">—</span> เราเน้นลดความกังวลที่เกินจริง ด้วยผลิตภัณฑ์ที่คุณภาพสูงที่ช่วยให้ลูกค้าได้รับความพึงพอใจ
          </li>
          <li className="flex items-start font-prompt">
            <span className="text-red-600 font-bold mr-2">—</span> ยืดหยุ่นและพร้อมที่จะปรับผลิตภัณฑ์และบริการให้ตรงกับความต้องการใหม่ ๆ
          </li>
        </ul>
      </div>
    </div>
  );
}

export default CoBannerHome;
