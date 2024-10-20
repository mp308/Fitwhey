import React from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import Banner00 from '../assets/images/Banner/FIXMAX_PERFORMANCE_Banner.jpg';
import Banner01 from '../assets/images/Banner/Banner01.jpg';
import Banner02 from '../assets/images/Banner/Banner02.jpg';
import Banner03 from '../assets/images/Banner/Banner03.jpg';
import Banner04 from '../assets/images/Banner/Banner04.jpg';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import { useUserAuth } from "../gobal/UserAuthContext"; // Import useUserAuth

const Content = () => {
  const { user } = useUserAuth(); // ใช้ Hook useUserAuth เพื่อดึงข้อมูล user
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนหน้า

  const handleSignIn = () => {
    navigate('/register'); // นำทางไปยังหน้า /register
  };

  const handleProducts = () => {
    navigate('/Products'); // นำทางไปยังหน้า /register
  };

  return (
    <>
      <div className='p-8 text-[#B7ADAD] font-prompt'>
        <div className="relative text-white">
          {/* ใช้ object-cover เพื่อให้ภาพครอบคลุมทุกพื้นที่ */}
          <img src={Banner04} alt="" className="w-full h-[300px] md:h-[500px] lg:h-[700px] object-cover" />

          {/* Overlay สีดำที่มี opacity */}
          <div className="absolute inset-0 bg-black opacity-70"></div>

          {/* ข้อความที่ซ้อนอยู่บนแบนเนอร์ */}
          <div className="absolute top-10 left-0 w-full h-full flex flex-col justify-center items-start text-left px-4 md:px-10 lg:px-20 z-10">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">เลือกสิ่งที่ดีให้กับคุณ</h1>

            <div className="text-sm md:text-lg lg:text-xl mb-4">
              <p>
                หากคุณกำลังมองหาเวย์โปรตีนคุณภาพสูงสำหรับเสริมสร้างกล้ามเนื้อหรือผลิตภัณฑ์ที่ช่วยให้
              </p>
              <p>
                การออกกำลังกายมีประสิทธิภาพมากขึ้น เรามีตัวเลือกหลากหลายที่ตอบโจทย์ทุกความต้องการของคุณ
              </p>
            </div>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold mb-4">สมัครตอนนี้รับส่วนลด 10%</h1>

            {/* ปุ่ม */}
            {!user ? (
              <button  onClick={handleSignIn} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Sign In Now
              </button>
            ) : (
              <button onClick={handleProducts} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Shopping Now
              </button>
            )}

            <button className="text-white underline mt-4">รายละเอียด</button>
          </div>
        </div>

        {/* Product Section */}
        {/* <div className='font-bebas my-9'>
          <h1 className='text-5xl text-black'>FitMax Performance Products</h1>
          <p>
            Iconography is a crucial part of any design system or digital experience. These language-independent symbols can be used for navigating, signposting and can help to build meaningful associations to complex or abstract ideas.
          </p>
        </div> */}

        {/* Color Boxes */}
        {/* <div className='flex flex-row space-x-4'>
          <div className='bg-red-500 w-[500px] h-[500px]'>Red Box</div>
          <div className='bg-blue-500 w-[500px] h-[500px]'>Blue Box</div>
          <div className='bg-green-500 w-[500px] h-[500px]'>Green Box</div>
          <div className='bg-yellow-500 w-[500px] h-[500px]'>Yellow Box</div>
          <div className='bg-purple-500 w-[500px] h-[500px]'>Purple Box</div>
        </div> */}
      </div>
    </>
  );
}

export default Content;
