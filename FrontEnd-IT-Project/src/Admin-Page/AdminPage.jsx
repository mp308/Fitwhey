import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/NavBar';
import Footer from '../component/Footer';
import ProductManager from '../component/Admin-Component/ProductManager';
import OrderManager from '../component/Admin-Component/OrderManager';
import ReviewManager from '../component/Admin-Component/ReviewManager';
import DiscountManager from '../component/Admin-Component/DiscounManger';
import ApplyDiscountToAllUsers from '../component/Admin-Component/ApplyDiscountToAllUsers';
import UserManager from '../component/Admin-Component/UserManager';
import { useUserAuth } from '../gobal/UserAuthContext';

function AdminPage() {
  const { user } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // ตรวจสอบว่า user มีข้อมูลและมี role เป็น 'Admin'
    if (user && user.role !== 'Admin') {
      navigate('/'); // เปลี่ยนเส้นทางไปหน้า Home โดยตรงถ้า role ไม่ใช่ Admin
    }
  }, [user, navigate]);

  // ตรวจสอบว่าข้อมูล user ถูกโหลดแล้ว ก่อนแสดงผล
  if (!user) {
    return null; // หรือคุณอาจแสดง Loading Spinner ก็ได้
  }

  return (
    <>
      <Header />
      <ProductManager />
      <DiscountManager/>
      <ApplyDiscountToAllUsers/>
      <UserManager/>
      <OrderManager />
      <ReviewManager />
      <Footer />
    </>
  );
}

export default AdminPage;
