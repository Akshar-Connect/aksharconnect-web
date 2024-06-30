import axios from "axios";

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDA0MSwiZW1haWwiOm51bGwsImFrc2hhcklkIjoiQUMxNDA0MSIsImlhdCI6MTcxOTA2MzQ1MywiZXhwIjoxNzE5MDc0MjUzfQ.tU0mImg1n4hW_dHD8WcO4ByYpZvIUNWxhZ17HLMyvd4";
const  fetchApi=async(axiosConfig)=> {
    const configs = {
        ...axiosConfig,
      };
      axios.defaults.baseURL = 'https://ac-be-app-prod-spyo2pxfka-el.a.run.app'
      axios.defaults.headers.common = {'Authorization': `bearer ${token}`}

  try {
    const resp = await axios(configs);
    return resp;
  } catch (error) {
    throw error;
  }
}

export  {fetchApi}