import React, { useEffect, useRef, useLayoutEffect } from 'react'; // เพิ่ม useEffect, useLayoutEffect และ useRef
import gsap from 'gsap'; // นำเข้า gsap สำหรับอนิเมชั่น
import Header from '../component/NavBar';
import Footer from '../component/Footer';
import Content from '../component/Content';
import Product_ex from '../component/Product_ex';
import { useUserAuth } from '../gobal/UserAuthContext';



const HomePage = () => {
  const { user } = useUserAuth();

  // ตั้งค่าชื่อของ title ของหน้า
  useEffect(() => {
    document.title = "Sanpitch Port";
  }, []);

  const comp = useRef(null); // ใช้สำหรับการอ้างอิง DOM

  // // ใช้ GSAP ในการทำอนิเมชั่น
  // useLayoutEffect(() => {
  //   let ctx = gsap.context(() => {
  //     const t1 = gsap.timeline();
  //     t1.from(["#title-1", "#title-2", "#title-3"], {
  //       opacity: 0,
  //       y: "+=30",
  //       stagger: 0.5,
  //     })
  //       .to(["#title-1", "#title-2", "#title-3"], {
  //         opacity: 0,
  //         y: "-=30",
  //         delay: 0.5,
  //         stagger: 0.5,
  //       })
  //       .to("#intro-slider", {
  //         xPercent: "-100",
  //         duration: 1.3,
  //       })
  //       .from("#welcome", {
  //         opacity: 0,
  //         duration: 0.5,
  //       });
  //   }, comp);

  //   return () => ctx.revert(); // ทำการ revert เมื่อคอมโพเนนต์ถูก unmount
  // }, []);

  return (
    <>
      {/* <div className='relative' ref={comp}>
        <div id='intro-slider'
          className='h-screen p-10 bg-gray-50 absolute top-0 left-0 font-bebas z-10 w-full flex flex-col gap-10 tracking-tight '>
          <h1 id='title-1'
            className='text-4xl md:text-6xl lg:text-9xl '>SANPITCH</h1>
          <h1 id='title-2'
            className='text-4xl md:text-6xl lg:text-9xl '>PHUVAPAISANKIT</h1>
          <h1 id='title-3'
            className='text-4xl md:text-6xl lg:text-9xl '>Graphics & Webdev</h1>
        </div>
      </div>

      <div id='welcome' className="bg-[#1b1b1b] text-white"></div> */}

      <div className='bg-[#f1eeee] min-h-screen'>
        <Header />
        {/* <p>UserName : {user?.username}</p> */} {/* แสดงชื่อผู้ใช้ถ้ามี */}
        <Content />
        <Product_ex />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
