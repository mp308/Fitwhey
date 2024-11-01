import React, { useEffect, useRef, useLayoutEffect } from 'react'; // เพิ่ม useEffect, useLayoutEffect และ useRef
import gsap from 'gsap'; // นำเข้า gsap สำหรับอนิเมชั่น
import Header from '../component/NavBar';
import Footer from '../component/Footer';
import Content from '../component/Content';
import Product_ex from '../component/Product_ex';
import ApplyDiscountToUsers from '../component/ApplyDiscountToUsers';
import CoBannerHome from '../component/CoBannerHome';

const HomePage = () => {
  return (
    <>
        <Header />
        <Content />
        <Product_ex />
        <CoBannerHome/>
        <ApplyDiscountToUsers/>    
        <Footer />

    </>
  );
};

export default HomePage;
