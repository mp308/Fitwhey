import React from 'react';
import Black from '../assets/images/Banner/black.jpg';
import Snack from '../assets/images/Banner/Protein_Bars_Collection.jpg';
import Creatine from '../assets/images/Banner/creatine.jpg';
import Ac from '../assets/images/Banner/ac.jpg'
import Sp from '../assets/images/Banner/sp.jpg'

import { useNavigate } from 'react-router-dom';

const Product_ex = () => {
    const navigate = useNavigate();

    // ฟังก์ชันเมื่อกดปุ่ม View จะส่ง CategoryID ไปที่หน้า Product_Main
    const handleViewCategory = (categoryID) => {
        navigate('/products', { state: { selectedCategory: categoryID } });
    };

    return (
        <div className='bg-white py-8'>
            {/* Product Categories */}
            <div className='flex justify-center space-x-6 my-8'>
                {/* Whey Protein */}
                <div className='relative w-[300px] h-[350px] bg-gray-800 text-white flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg'>
                    <img src={Black} alt="Whey Protein" className="absolute top-0 left-0 w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <h2 className='relative font-bebas text-5xl font-bold uppercase z-10 mb-4 tracking-widest'>WHEY PROTEIN</h2>
                    <button
                        onClick={() => handleViewCategory(1)} // ส่งค่า CategoryID สำหรับ Whey Protein
                        className='relative bg-red-600 hover:bg-red-700 px-6 py-2 text-sm uppercase font-bebas tracking-wider z-10'
                    >
                        View
                    </button>
                </div>
                
                {/* Supplement */}
                <div className='relative w-[300px] h-[350px] bg-gray-800 text-white flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg'>
                    <img src={Creatine} alt="Supplement" className="absolute top-0 left-0 w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <h2 className='relative font-bebas text-5xl font-bold uppercase z-10 mb-4 tracking-widest'>SUPPLEMENT</h2>
                    <button
                        onClick={() => handleViewCategory(2)} // ส่งค่า CategoryID สำหรับ Supplement
                        className='relative bg-red-600 hover:bg-red-700 px-6 py-2 text-sm uppercase font-bebas tracking-wider z-10'
                    >
                        View
                    </button>
                </div>
                
                {/* Snack */}
                <div className='relative w-[300px] h-[350px] bg-gray-800 text-white flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg'>
                    <img src={Snack} alt="Snack" className="absolute top-0 left-0 w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <h2 className='relative font-bebas text-5xl font-bold uppercase z-10 mb-4 tracking-widest'>SNACK</h2>
                    <button
                        onClick={() => handleViewCategory(3)} // ส่งค่า CategoryID สำหรับ Snack
                        className='relative bg-red-600 hover:bg-red-700 px-6 py-2 text-sm uppercase font-bebas tracking-wider z-10'
                    >
                        View
                    </button>
                </div>

                {/* Accessory */}
                <div className='relative w-[300px] h-[350px] bg-gray-800 text-white flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg'>
                    <img src={Ac} alt="Accessory" className="absolute top-0 left-0 w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <h2 className='relative font-bebas text-5xl font-bold uppercase z-10 mb-4 tracking-widest'>Accessory</h2>
                    <button
                        onClick={() => handleViewCategory(4)} // ส่งค่า CategoryID สำหรับ Snack
                        className='relative bg-red-600 hover:bg-red-700 px-6 py-2 text-sm uppercase  tracking-wider z-10 font-bebas'
                    >
                        View
                    </button>
                </div>

                {/* special */}
                <div className='relative w-[300px] h-[350px] bg-gray-800 text-white flex flex-col items-center justify-center overflow-hidden rounded-lg shadow-lg'>
                    <img src={Sp} alt="special" className="absolute top-0 left-0 w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                    <h2 className='relative font-bebas text-5xl font-bold uppercase z-10 mb-4 tracking-widest'>special</h2>
                    <button
                        onClick={() => handleViewCategory(5)} // ส่งค่า CategoryID สำหรับ Snack
                        className='relative bg-red-600 hover:bg-red-700 px-6 py-2 text-sm uppercase font-bebas tracking-wider z-10'
                    >
                        View
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Product_ex;
