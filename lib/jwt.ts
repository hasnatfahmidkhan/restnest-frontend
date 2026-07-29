import jwt from "jsonwebtoken";
const verifyJWTToken = (accessToken: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(accessToken, secret);
    return {
      verifiedToken,
      success: true,
    };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("Token verification failed!");
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  verifyJWTToken,
};
