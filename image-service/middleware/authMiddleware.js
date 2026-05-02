const { createRemoteJWKSet, jwtVerify } = require("jose");

const issuer = process.env.KEYCLOAK_ISSUER_URI || "http://localhost:8090/realms/journal-realm";
const jwksUri =
  process.env.KEYCLOAK_JWKS_URI ||
  "http://localhost:8090/realms/journal-realm/protocol/openid-connect/certs";

const JWKS = createRemoteJWKSet(new URL(jwksUri));

async function authenticateToken(req, res, next) {
  const authorization = req.headers.authorization || "";
  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Missing bearer token" });
  }

  try {
    const { payload } = await jwtVerify(token, JWKS, { issuer });
    req.auth = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const roles = req.auth?.realm_access?.roles || [];
    const isAllowed = allowedRoles.some((role) => roles.includes(role));

    if (!isAllowed) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  authorizeRoles
};
