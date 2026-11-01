import { beforeEach, describe, expect, it, vi } from "vitest";

const getAdminMock = vi.fn();
const insertReturningMock = vi.fn();

vi.mock("@/lib/auth/require-admin", () => ({
  getAdmin: getAdminMock,
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        orderBy: vi.fn().mockResolvedValue([]),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(() => ({
        returning: insertReturningMock,
      })),
    })),
  },
}));

describe("POST /api/players", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 403 for signed-in non-admin users", async () => {
    getAdminMock.mockResolvedValue({ status: 403 });

    const { POST } = await import("@/app/api/players/route");
    const response = await POST(
      new Request("http://localhost/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Blocked Player",
          role: "BATSMAN",
          basePrice: 100000,
          matchesPlayed: 0,
          totalRuns: 0,
          totalWickets: 0,
        }),
      }),
    );

    expect(response.status).toBe(403);
    await expect(response.json()).resolves.toEqual({ error: "Forbidden" });
    expect(insertReturningMock).not.toHaveBeenCalled();
  });
});
