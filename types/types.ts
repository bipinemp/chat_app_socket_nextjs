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
