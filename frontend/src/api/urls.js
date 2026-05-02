// urls.js
const isLocalHost =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

function resolveUrl(envValue, localValue, cloudValue) {
  if (envValue) {
    return envValue;
  }

  return isLocalHost ? localValue : cloudValue;
}

const USER_SERVICE_URL = resolveUrl(
  process.env.REACT_APP_USER_SERVICE_URL,
  "http://localhost:8081",
  "https://journal-user1.app.cloud.cbh.kth.se"
);
const PATIENT_SERVICE_URL = resolveUrl(
  process.env.REACT_APP_PATIENT_SERVICE_URL,
  "http://localhost:8082",
  "https://journal-patient1.app.cloud.cbh.kth.se"
);
const MESSAGE_SERVICE_URL = resolveUrl(
  process.env.REACT_APP_MESSAGE_SERVICE_URL,
  "http://localhost:8083",
  "https://journal-message1.app.cloud.cbh.kth.se"
);
const IMAGE_SERVICE_URL = resolveUrl(
  process.env.REACT_APP_IMAGE_SERVICE_URL,
  "http://localhost:8084",
  "https://journal-image1.app.cloud.cbh.kth.se"
);
const SEARCH_SERVICE_URL = resolveUrl(
  process.env.REACT_APP_SEARCH_SERVICE_URL,
  "http://localhost:8085",
  "https://journal-search1.app.cloud.cbh.kth.se"
);
const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL || "http://localhost:8090";
const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || "journal-realm";
const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "journal-frontend";

export {
  USER_SERVICE_URL,
  PATIENT_SERVICE_URL,
  MESSAGE_SERVICE_URL,
  IMAGE_SERVICE_URL,
  SEARCH_SERVICE_URL,
  KEYCLOAK_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID
};
