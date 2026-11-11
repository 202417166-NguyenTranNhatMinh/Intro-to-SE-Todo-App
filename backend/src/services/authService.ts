import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { upsertGoogleUser } from "../repo/userRepo";

const googleClient = new OAuth2Client(
  env.googleClientId,
  env.googleClientSecret,
  env.googleCallbackUrl,
);

export function createGoogleAuthorizationUrl(state: string): string {
  return googleClient.generateAuthUrl({
    access_type: "online",
    scope: ["openid", "email", "profile"],
    state,
    prompt: "select_account",
  });
}

export async function signInWithGoogleCode(code: string) {
  const { tokens } = await googleClient.getToken(code);

  if (!tokens.id_token) {
    throw new Error("Google did not return an ID token");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || !payload.email_verified) {
    throw new Error("Google account has no verified email");
  }

  const user = await upsertGoogleUser({
    googleId: payload.sub,
    email: payload.email,
    displayName: payload.name ?? payload.email,
    avatarUrl: payload.picture ?? null,
  });

  const sessionToken = jwt.sign(
    { userId: user.id },
    env.jwtSecret,
    { expiresIn: "7d" },
  );

  return { user, sessionToken };
}