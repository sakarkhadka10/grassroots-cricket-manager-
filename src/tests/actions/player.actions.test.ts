import { beforeEach, describe, expect, it, vi } from "vitest";

const getAdminMock = vi.fn();
const insertValuesMock = vi.fn();

vi.mock("@/lib/auth/require-admin", () => ({
  getAdmin: getAdminMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/db", () => ({
  db: {
    insert: vi.fn(() => ({
      values: insertValuesMock,
    })),
  },
}));

function validPlayerFormData() {
  const formData = new FormData();
  formData.set("name", "Regular User Player");
  formData.set("role", "BATSMAN");
  formData.set("basePrice", "100000");
  formData.set("matchesPlayed", "0");
  formData.set("totalRuns", "0");
  formData.set("totalWickets", "0");
  return formData;
}

describe("createPlayerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    insertValuesMock.mockResolvedValue(undefined);
  });

  it("does not add a player when the user is not an admin", async () => {
    getAdminMock.mockResolvedValue({ status: 403 });

    const { createPlayerAction } = await import("@/actions/player.actions");
    const result = await createPlayerAction({ success: false, message: "" }, validPlayerFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe("You do not have permission to add players.");
    expect(insertValuesMock).not.toHaveBeenCalled();
  });

  it("does not add a player when the user is not signed in", async () => {
    getAdminMock.mockResolvedValue({ status: 401 });

    const { createPlayerAction } = await import("@/actions/player.actions");
    const result = await createPlayerAction({ success: false, message: "" }, validPlayerFormData());

    expect(result.success).toBe(false);
    expect(result.message).toBe("You do not have permission to add players.");
    expect(insertValuesMock).not.toHaveBeenCalled();
  });
});
