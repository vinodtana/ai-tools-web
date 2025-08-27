export const API_BASE = "/api";
export const GRAPH_BASE = "https://graph.facebook.com/v6.0";

// http://195.95.200.22:8080/focusnextrestservices/api/auth/signin

// http://195.95.200.22:8080/focusnextrestservices/api/getallleads
// [7:17 pm] Upendra Kumar Manike
// 65.0.75.211

let SERVER_IP_URL;

let SERVER_IP_URL1 = "https://api.topaitools.ai/api";

if (typeof window !== "undefined") {
  if (window.location.hostname === "localhost") {
    SERVER_IP_URL = "https://localhost:8443/api";
    // SERVER_IP_URL1 = "http://localhost:2020/api";
    // SERVER_IP_URL = "http://65.1.82.82:8080/focusnextrestservices/api";
    SERVER_IP_URL = "https://api.topaitools.ai/api";
    SERVER_IP_URL1 = "https://api.topaitools.ai/api";
  } else {
    SERVER_IP_URL1 = "https://api.topaitools.ai/api";
    // SERVER_IP_URL = "http://65.1.82.82:8080/focusnextrestservices/api";
    SERVER_IP_URL = "https://api.topaitools.ai/api";
  }
}
const MIXPANEL_ID1 = "ef8786e1b4be644396cef0543f380841";
export const SERVER_IP = SERVER_IP_URL;
export const NODE_SERVER_IP = SERVER_IP_URL1;
const map_url =
  "https://maps.googleapis.com/maps/api/js?key=AIzaSyDILWRZ3d-zi2xIjmATRtOUNkFJ8kEr4p0&libraries=places";
export const GOOGLE_MAP_URL = map_url;
export const MIXPANEL_ID = MIXPANEL_ID1;
export const S3_BUCKET = "rasko-images";
// .s3.ap-south-1.amazonaws.com
export const REGION = "us-east-1";
