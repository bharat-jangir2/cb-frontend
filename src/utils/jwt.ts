// JWT utility functions for debugging and validation

export interface JWTPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const jwtUtils = {
  // Decode JWT token without verification (for debugging)
  decodeToken: (token: string): JWTPayload | null => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("❌ JWT decode error:", error);
      return null;
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    const payload = jwtUtils.decodeToken(token);
    if (!payload) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  },

  // Get token expiration time
  getTokenExpiration: (token: string): Date | null => {
    const payload = jwtUtils.decodeToken(token);
    if (!payload) return null;

    return new Date(payload.exp * 1000);
  },

  // Get time until token expires
  getTimeUntilExpiration: (token: string): number | null => {
    const payload = jwtUtils.decodeToken(token);
    if (!payload) return null;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp - currentTime;
  },

  // Debug token information
  debugToken: (token: string): void => {
    const payload = jwtUtils.decodeToken(token);
    if (!payload) {
      console.log("❌ Invalid JWT token");
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    const timeUntilExpiry = payload.exp - currentTime;

    console.log("🔍 JWT Token Debug:", {
      subject: payload.sub,
      email: payload.email,
      role: payload.role,
      issuedAt: new Date(payload.iat * 1000).toISOString(),
      expiresAt: new Date(payload.exp * 1000).toISOString(),
      isExpired,
      timeUntilExpiry: timeUntilExpiry > 0 ? `${timeUntilExpiry}s` : "EXPIRED",
      currentTime: new Date(currentTime * 1000).toISOString(),
    });
  },
};
