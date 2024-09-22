import axios from "axios";

export const getIpInDBIP = async () => {
  try {
    const url = `${process.env.NEXT_PUBLIC_CHECK_IPADDRESS_DBIP}`;
    const res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
    return res.data;
  } catch (err) {
    return Promise.reject(err);
  }
};
