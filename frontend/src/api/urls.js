// urls.js
const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || "http://localhost:8081";
const PATIENT_SERVICE_URL = process.env.REACT_APP_PATIENT_SERVICE_URL || "http://localhost:8082";
const MESSAGE_SERVICE_URL = process.env.REACT_APP_MESSAGE_SERVICE_URL || "http://localhost:8083";
const IMAGE_SERVICE_URL = process.env.REACT_APP_IMAGE_SERVICE_URL || "http://localhost:8084";
const SEARCH_SERVICE_URL = process.env.REACT_APP_SEARCH_SERVICE_URL || "http://localhost:8085";

export {
  USER_SERVICE_URL,
  PATIENT_SERVICE_URL,
  MESSAGE_SERVICE_URL,
  IMAGE_SERVICE_URL,
  SEARCH_SERVICE_URL
};