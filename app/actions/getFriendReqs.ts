import axios from "axios";

const getFriends = async () => {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/chat/getfriendreqs"
    );
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export default getFriends;
