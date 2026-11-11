import { pool } from "../config/db";

export type GoogleUser = {
  googleId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

export type AppUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

export async function upsertGoogleUser(user: GoogleUser): Promise<AppUser> {
  const result = await pool.query<AppUser>(
    `
      INSERT INTO users (google_id, email, display_name, avatar_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (google_id)
      DO UPDATE SET
        email = EXCLUDED.email,
        display_name = EXCLUDED.display_name,
        avatar_url = EXCLUDED.avatar_url,
        updated_at = NOW()
      RETURNING
        id,
        email,
        display_name AS "displayName",
        avatar_url AS "avatarUrl";
    `,
    [user.googleId, user.email, user.displayName, user.avatarUrl],
  );

  return result.rows[0];
}

export async function findUserById(id: string): Promise<AppUser | null> {
  const result = await pool.query<AppUser>(
    `
      SELECT
        id,
        email,
        display_name AS "displayName",
        avatar_url AS "avatarUrl"
      FROM users
      WHERE id = $1
    `,
    [id],
  );

  return result.rows[0] ?? null;
}