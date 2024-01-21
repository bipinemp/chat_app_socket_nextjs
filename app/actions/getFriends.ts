import axios from "axios";

const getFriends = async () => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/chat/getfriends`
    );
    return response.data;
  } catch (error: any) {
    return error;
  }
};

export default getFriends;
