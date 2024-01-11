// store.ts
import { create } from "zustand";

interface NotificationType {
  message: string;
  username: string;
  image?: string;
  senderId?: string;
  receiverId: string;
  read?: boolean;
}

interface ChatOpened {
  notifications: NotificationType[];
  userId: string;
  setUserId: (userId: string) => void;
  setNotifications: (
    update: (prev: NotificationType[]) => NotificationType[]
  ) => void;

  resetNotifications: () => void;
  markAllAsread: () => void;
}

export const useWhichUserChatOpened = create<ChatOpened>((set) => ({
  notifications: [],
  userId: "",
  setUserId: (userId) => set({ userId }),
  setNotifications: (update) =>
    set((state) => ({ notifications: update(state.notifications) })),
  resetNotifications: () => set({ notifications: [] }),
  markAllAsread: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
}));

interface FriendsStore {
  friends: UserDetail[];
  addFriend: (friend: UserDetail) => void;
}

const useFriendsStore = create<FriendsStore>((set) => ({
  friends: [],
  addFriend: (friend) =>
    set((state) => {
      // Check if the friend already exists in the array
      const friendExists = state.friends.some(
        (existingFriend) => existingFriend.id === friend.id
      );

      // Add the friend to the array only if they don't exist already
      if (!friendExists) {
        return { friends: [friend, ...state.friends] };
      }

      return state;
    }),
}));

export default useFriendsStore;
