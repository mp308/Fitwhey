import React, { createContext, useContext, useState, useEffect } from "react";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  // ตรวจสอบว่า token มีอยู่ใน localStorage หรือไม่
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    console.log("Stored Token:", token); // ตรวจสอบ token ที่เก็บใน localStorage
    console.log("Stored User:", storedUser); // ตรวจสอบข้อมูลผู้ใช้ใน localStorage
  
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // ตั้งค่าผู้ใช้จาก localStorage
    }
  }, []);

  const logIn = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      console.log("Response Status:", response.status); // ตรวจสอบสถานะการตอบกลับ
      if (response.ok) {
        const data = await response.json();
        console.log("Login Data:", data); // ตรวจสอบข้อมูลที่ได้จากการตอบกลับ API

        const { id, role, token } = data;

        // Store token and user info (including id and role) in localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify({ id, username, role }));

        // Update state
        setUser({ id, username, role });
      } else {
        console.log('Invalid username or password');
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred while logging in');
    }
  };

  const logOut = async () => {
    const authToken = localStorage.getItem('authToken');
    
    try {
      const response = await fetch('http://localhost:8080/api/v1/logout', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
  
      console.log("Logout Response Status:", response.status); // Log status
      
      if (response.ok) {
        // Clear local storage and reset user state
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        console.log("authToken and user removed from localStorage"); // ตรวจสอบว่าข้อมูลถูกลบแล้ว
        setUser(null); // Reset state
  
        alert('Logout success!');
      } else {
        alert('Error on logout!');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred while logging out');
    }
  };

  return (
    <userAuthContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
