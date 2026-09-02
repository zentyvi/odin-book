import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [guestMode, setGuestMode] = useState(
    localStorage.getItem("mode") === "GUEST",
  );

  const continueAsGuest = () => {
    localStorage.setItem("mode", "GUEST");
    setGuestMode(true);
  };

  const login = (newToken, userData = null) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    setGuestMode(false);
    localStorage.removeItem("mode");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const mergeFriends = (existingFriends, newFriends) => {
    const friendsMap = new Map();

    existingFriends.forEach((f) => friendsMap.set(f.id, f));

    newFriends.forEach((newFriend) => {
      const existing = friendsMap.get(newFriend.id);

      if (existing) {
        friendsMap.set(newFriend.id, { ...existing, ...newFriend });
      } else {
        friendsMap.set(newFriend.id, newFriend);
      }
    });

    return Array.from(friendsMap.values());
  };

  const removeFriendFromCache = (friendId) => {
    if (!user) return;
    const friends = user?.friends || [];
    setUser((prev) => {
      return { ...prev, friends: friends.filter((f) => f.id !== friendId) };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        guestMode,
        setGuestMode,
        continueAsGuest,
        token,
        setToken,
        user,
        setUser,
        mergeFriends,
        removeFriendFromCache,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line
export const useAuth = () => useContext(AuthContext);
