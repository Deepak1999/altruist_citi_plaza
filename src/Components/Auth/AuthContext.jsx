import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [menuData, setMenuData] = useState(() => {
        const stored = localStorage.getItem('menuData');
        return stored ? JSON.parse(stored) : [];
    });

    return (
        <AuthContext.Provider value={{ menuData, setMenuData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
