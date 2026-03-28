import { eq } from "drizzle-orm";
import { db } from "../../database";
import { users } from "../../database/schema";
import type { AuthResponse } from "./model";

interface ServiceError {
  status: number;
  message: string;
}

type ServiceResult<T> = T | ServiceError;

function isServiceError(result: ServiceResult<unknown>): result is ServiceError {
  return typeof result === "object" && result !== null && "status" in result;
}

/** Google ID token payload (subset of fields we use). */
interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  email_verified: boolean;
}

abstract class AuthService {
  /**
   * Verify a Google credential (ID token) by calling Google's tokeninfo endpoint.
   * Returns the decoded payload or a ServiceError.
   */
  static async verifyGoogleToken(
    credential: string,
  ): Promise<ServiceResult<GoogleTokenPayload>> {
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
    );

    if (!response.ok) {
      return { status: 401, message: "Invalid Google credential" };
    }

    const payload = (await response.json()) as Record<string, unknown>;

    // Validate required fields
    if (!payload.sub || !payload.email) {
      return { status: 401, message: "Incomplete Google token payload" };
    }

    // Validate audience matches our client ID
    const expectedClientId = process.env.GOOGLE_CLIENT_ID;
    if (expectedClientId && payload.aud !== expectedClientId) {
      return { status: 401, message: "Google token audience mismatch" };
    }

    // Ensure email is verified
    if (
      payload.email_verified !== true &&
      payload.email_verified !== "true"
    ) {
      return { status: 401, message: "Google email not verified" };
    }

    return {
      sub: payload.sub as string,
      email: payload.email as string,
      name: (payload.name as string) || (payload.email as string).split("@")[0],
      email_verified: true,
    };
  }

  /**
   * Find or create a user by their Google account.
   * If the user exists (by googleId), update their email/username.
   * If not, create a new record.
   */
  static async findOrCreateByGoogle(
    google: GoogleTokenPayload,
  ): Promise<ServiceResult<AuthResponse>> {
    // Check if user exists by Google ID
    const [existing] = await db
      .select({
        id: users.id,
        googleId: users.googleId,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.googleId, google.sub))
      .limit(1);

    if (existing) {
      // Update email/username in case they changed on Google's side
      if (existing.email !== google.email || existing.username !== google.name) {
        await db
          .update(users)
          .set({ email: google.email, username: google.name })
          .where(eq(users.googleId, google.sub));
      }

      return {
        id: existing.id,
        googleId: existing.googleId,
        username: google.name,
        email: google.email,
      };
    }

    // Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        googleId: google.sub,
        email: google.email,
        username: google.name,
      })
      .returning({
        id: users.id,
        googleId: users.googleId,
        username: users.username,
        email: users.email,
      });

    return newUser;
  }

  /**
   * Find a user by their internal ID.
   */
  static async findById(
    id: string,
  ): Promise<ServiceResult<AuthResponse>> {
    const [user] = await db
      .select({
        id: users.id,
        googleId: users.googleId,
        username: users.username,
        email: users.email,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return { status: 404, message: "User not found" };
    }

    return user;
  }
}

export { AuthService, isServiceError };
export type { ServiceError, ServiceResult };
