#!/usr/bin/env node

/**
 * 🧪 API Validation Script for Saturn MVP
 * Tests key endpoints against live server to ensure compliance
 */

const API_BASE = "https://saturn.foryoupage.org/api";

const TEST_CREDENTIALS = {
  username: "testuser",
  password: "SecurePassword123!",
};

let authToken = null;

async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    console.log(`🔍 Testing: ${options.method || "GET"} ${url}`);
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    console.log(`📊 Status: ${response.status}`);
    console.log(`📦 Response:`, JSON.stringify(data, null, 2));

    return { response, data, success: response.ok };
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { error, success: false };
  }
}

async function testAuthentication() {
  console.log("\n🔐 Testing Authentication...");

  // Test login
  const loginResult = await makeRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(TEST_CREDENTIALS),
  });

  if (loginResult.success && loginResult.data.token) {
    authToken = loginResult.data.token;
    console.log("✅ Login successful!");

    // Test /me endpoint
    const meResult = await makeRequest("/auth/me");
    if (meResult.success) {
      console.log("✅ /auth/me endpoint working!");
    } else {
      console.log("❌ /auth/me endpoint failed");
    }
  } else {
    console.log("❌ Login failed");
    return false;
  }

  return true;
}

async function testSearch() {
  console.log("\n🔍 Testing Search...");

  const searchResult = await makeRequest("/actors/search?q=content");
  if (searchResult.success && searchResult.data.status === "success") {
    console.log("✅ Actor search working!");
    console.log(`📊 Found ${searchResult.data.data.length} users`);
  } else {
    console.log("❌ Actor search failed");
  }
}

async function testPosts() {
  console.log("\n📝 Testing Posts...");

  const feedResult = await makeRequest("/posts?page=1&limit=5");
  if (feedResult.success && feedResult.data.status === "success") {
    console.log("✅ Posts feed working!");
    console.log(`📊 Found ${feedResult.data.posts.length} posts`);
  } else {
    console.log("❌ Posts feed failed");
  }
}

async function testHealthCheck() {
  console.log("\n❤️ Testing Health Check...");

  try {
    const response = await fetch("https://saturn.foryoupage.org/health");
    const data = await response.json();

    if (response.ok) {
      console.log("✅ Server health check passed!");
      console.log("📊 Server status:", data);
    } else {
      console.log("❌ Server health check failed");
    }
  } catch (error) {
    console.log("❌ Server unreachable:", error.message);
  }
}

async function runValidation() {
  console.log("🚀 Saturn MVP API Validation");
  console.log("============================");

  await testHealthCheck();

  const authSuccess = await testAuthentication();
  if (!authSuccess) {
    console.log("❌ Cannot proceed without authentication");
    return;
  }

  await testSearch();
  await testPosts();

  console.log("\n✅ Validation complete!");
  console.log("🎯 Check the logs above for any issues");
}

// Run validation if called directly
if (require.main === module) {
  runValidation().catch(console.error);
}

module.exports = { runValidation };
