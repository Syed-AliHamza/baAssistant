'use client'

import { useState, useContext, createContext, useEffect } from 'react';

const LOCAL_STORAGE_ENTRIES = {
  user: "user",
};

const AuthContext = createContext(null);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  

  let initData ;


  useEffect(() => {
  
    initData =  localStorage.getItem(LOCAL_STORAGE_ENTRIES.user) || {
      isAuthenticated: false,
      token: null,
      data: {},
      announcement: [],
      editTopic: false,
      isAdminView: false,
    };


  }, []);



  const [user, setUser] = useState(initData);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
