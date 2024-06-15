import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      userDetailsStore: null,
      isUserLoggedInStore: false,
      rolesStore: [],
      updateIsUserLoggedIn: (isUserLoggedInStore) => set({ isUserLoggedInStore }),
      updateUserDetails: (userDetailsStore) => {
        set({ userDetailsStore });
      },
      setRoles: (rolesStore) => {
        set({ rolesStore });
      },
      deleteRole: (roleId) => {
        set((state) => ({
          rolesStore: state.rolesStore.filter((role) => role.id !== roleId),
        }));
      },
      addRole: (newRole) => {
        set((state) => ({
          rolesStore: [...state.rolesStore, newRole],
        }));
      },
    }),
    {
      name: 'user-storage', // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
