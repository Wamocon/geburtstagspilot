/**
 * Seed test users on production Supabase.
 * Uses the Auth Admin API via service_role key.
 *
 * Usage:  node scripts/seed-test-users.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, "../.env.local"), "utf-8");
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx > 0) {
    process.env[trimmed.slice(0, idx)] = trimmed.slice(idx + 1);
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_USERS = [
  { email: "admin@geburtstagspilot.de", password: "Admin123!", role: "admin", tier: "pro" },
  { email: "user@geburtstagspilot.de",  password: "User123!",  role: "user",  tier: "free" },
  { email: "pro@geburtstagspilot.de",   password: "Pro123!",   role: "user",  tier: "pro" },
];

async function seedUsers() {
  for (const u of TEST_USERS) {
    console.log(`\n--- ${u.email} ---`);

    // Check if user already exists
    const { data: existing } = await supabase.auth.admin.listUsers();
    const found = existing?.users?.find((x) => x.email === u.email);

    let userId;

    if (found) {
      console.log(`  Already exists (id: ${found.id}). Skipping auth creation.`);
      userId = found.id;
    } else {
      // Create user via Auth Admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
      });

      if (error) {
        console.error(`  Failed to create: ${error.message}`);
        continue;
      }

      userId = data.user.id;
      console.log(`  Created (id: ${userId})`);
    }

    // Update profile with role and tier
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: u.role, tier: u.tier })
      .eq("id", userId);

    if (profileError) {
      console.error(`  Profile update failed: ${profileError.message}`);
    } else {
      console.log(`  Profile set: role=${u.role}, tier=${u.tier}`);
    }
  }

  console.log("\nDone.");
}

seedUsers();
