type UserDetail = {
  id: string;
  username: string;
  password: string | null;
  email: string;
  emailVerified: string | null;
  image: string | null;
};

type TAcceptedFriends = {
  requester: UserDetail;
  receiver: UserDetail;
};

type TAcceptedFriedsArr = TAcceptedFriends[] | any[];

// search user results
type SearchResult = {
  users: UserDetail[];
};

// For notification
type NotificationType = {
  message: string;
  username: string;
  image?: string;
  senderId?: string;
  receiverId: string;
  type?: string;
  read?: boolean;
};

// for friend requests
type FriendRequest = {
  requester: UserDetail;
};

type FriendReqs = FriendRequest[];
