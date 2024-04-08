// middleware/csrf.js

import { randomBytes } from "crypto";

// Generate anti-CSRF token
export const generateCSRFToken = () => {
    return randomBytes(32).toString("hex");
};

// Middleware to set anti-CSRF token in response
export const setCSRFToken = (request, h) => {
    const csrfToken = generateCSRFToken();
    request.cookieAuth.set("csrfToken", csrfToken);
    //request.app.csrfToken = csrfToken;
    return h.continue;
};

// Middleware to validate anti-CSRF token in request
export const validateCSRFToken = (request, h) => {
    const csrfToken = request.cookieAuth.get("csrfToken");
    const requestToken = request.payload.csrfToken;

    if (!csrfToken || csrfToken !== requestToken) {
        return Boom.forbidden("Invalid CSRF token");
    }

    return h.continue;
};

