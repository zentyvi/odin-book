import { createContext, useContext, useEffect, useState } from "react";
import { filterData, mergeData } from "../utilis/helpers.js";
import { socket, unserialize_user } from "../api/connection.js";

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
    localStorage.removeItem("mode");
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    setGuestMode(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("settings");
    unserialize_user(user?.id);
    setToken(null);
    setUser(null);
  };

  const removeFromCache = (field, idToRemove) => {
    if (!user) {
      return;
    }
    const oldData = user[field] || [];
    if (oldData?.length === 0) {
      return;
    }
    setUser((prev) => {
      return {
        ...prev,
        [field]: filterData(oldData, idToRemove),
      };
    });
  };

  const removeFriendFromCache = (friendId) => {
    removeFromCache("friends", friendId);
  };

  const removeFriendReqestFromCache = (requestId) => {
    removeFromCache("receivedRequests", requestId);
  };

  const addFriendToCache = (friend) => {
    setUser((prev) => {
      const oldFriends = prev?.friends || [];
      return { ...prev, friends: mergeData(oldFriends, [friend]) };
    });
  };

  const updateFriendRequests = (newRequests) => {
    setUser((prev) => {
      const oldRequests = prev?.receivedRequests || [];
      return {
        ...prev,
        receivedRequests: mergeData(oldRequests, newRequests),
      };
    });
  };

  useEffect(() => {
    socket.on("friend_request", (newRequest) => {
      setUser((prev) => {
        const oldRequests = prev?.receivedRequests || [];
        return {
          ...prev,
          receivedRequests: [...oldRequests, newRequest],
        };
      });
    });

    socket.on("update_status", (data) => {
      const { userId, isOnline, lastSeen } = data;
      setUser((prev) => {
        const prevFriends = prev.friends || [];
        const newFriends = prevFriends.map((f) => {
          if (f.id === userId) {
            return { ...f, isOnline, lastSeen };
          }
          return f;
        });
        return { ...prev, friends: newFriends };
      });
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        login,
        logout,
        guestMode,
        setGuestMode,
        continueAsGuest,
        token,
        setToken,
        user,
        setUser,
        removeFromCache,
        removeFriendFromCache,
        removeFriendReqestFromCache,
        addFriendToCache,
        updateFriendRequests,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line
export const useAuth = () => useContext(AuthContext);
