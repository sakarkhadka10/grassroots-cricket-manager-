import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const authMock = vi.fn();
const limitMock = vi.fn();

vi.mock("@/auth", () => ({
  auth: authMock,
}));

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: limitMock,
        })),
      })),
    })),
  },
}));

describe("getAdmin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when there is no session", async () => {
    authMock.mockResolvedValue(null);

    const { getAdmin } = await import("@/lib/auth/require-admin");
    const result = await getAdmin();

    expect(result.status).toBe(401);
  });

  it("returns 403 when the signed-in user is not an admin", async () => {
    authMock.mockResolvedValue({ user: { id: "user-1" } });
    limitMock.mockResolvedValue([{ id: "user-1", role: "USER" }]);

    const { getAdmin } = await import("@/lib/auth/require-admin");
    const result = await getAdmin();

    expect(result.status).toBe(403);
  });

  it("returns 200 when the signed-in user is an admin", async () => {
    authMock.mockResolvedValue({ user: { id: "admin-1" } });
    limitMock.mockResolvedValue([{ id: "admin-1", role: "ADMIN" }]);

    const { getAdmin } = await import("@/lib/auth/require-admin");
    const result = await getAdmin();

    expect(result.status).toBe(200);
    if (result.status === 200) {
      expect(result.user.role).toBe("ADMIN");
    }
  });
});
