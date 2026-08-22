import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useFavoriteMover } from "@/hooks/useFavoriteMover";
import { addFavoriteMover, removeFavoriteMover } from "@/lib/api/favorites";
import { createQueryClientWrapper, createTestQueryClient } from "@/test/createQueryClientWrapper";
import { createDeferred } from "@/test/createDeferred";

vi.mock("@/lib/api/favorites", () => ({
  addFavoriteMover: vi.fn(),
  removeFavoriteMover: vi.fn(),
  removeFavoriteMoversBulk: vi.fn(),
}));
vi.mock("@/hooks/useCustomerAuthReady", () => ({
  useCustomerAuthReady: () => ({
    isPending: false,
    isAuthenticated: true,
    user: { id: "user-1", role: "CUSTOMER" },
  }),
}));
vi.mock("@/hooks/useAuthQueryScope", () => ({
  useAuthQueryScope: () => ({ authScope: "user:user-1", isAuthQueryReady: true }),
}));
vi.mock("@/lib/auth/session", () => ({
  getLoginRedirectPath: () => "/login",
  hasAuthSession: () => true,
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn() }) }));
vi.mock("@/components/auth/LoginRequiredModalProvider", () => ({
  useLoginRequiredModal: () => null,
}));

describe("useFavoriteMover", () => {
  afterEach(() => vi.clearAllMocks());

  it("요청 시작 전 ON → OFF가 끝나면 서버 요청을 보내지 않는다", async () => {
    const { result } = renderHook(() => useFavoriteMover(), {
      wrapper: createQueryClientWrapper(createTestQueryClient()),
    });

    act(() => {
      result.current.mutate({ moverId: "mover-1", nextIsFavorite: true });
      result.current.mutate({ moverId: "mover-1", nextIsFavorite: false });
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(addFavoriteMover).not.toHaveBeenCalled();
    expect(removeFavoriteMover).not.toHaveBeenCalled();
  });

  it("요청 중 ON → OFF → ON은 마지막 ON만 남겨 POST 한 건만 보낸다", async () => {
    const request = createDeferred<{ moverId: string; isFavorite: boolean }>();
    vi.mocked(addFavoriteMover).mockReturnValueOnce(request.promise);
    const { result } = renderHook(() => useFavoriteMover(), {
      wrapper: createQueryClientWrapper(createTestQueryClient()),
    });

    act(() => result.current.mutate({ moverId: "mover-1", nextIsFavorite: true }));
    await waitFor(() => expect(addFavoriteMover).toHaveBeenCalledTimes(1));

    act(() => {
      result.current.mutate({ moverId: "mover-1", nextIsFavorite: false });
      result.current.mutate({ moverId: "mover-1", nextIsFavorite: true });
    });
    await act(async () => request.resolve({ moverId: "mover-1", isFavorite: true }));

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(addFavoriteMover).toHaveBeenCalledTimes(1);
    expect(removeFavoriteMover).not.toHaveBeenCalled();
  });

  it("진행 중 요청과 최종 의도가 다르면 완료 뒤 필요한 다음 요청 한 건을 보낸다", async () => {
    const addRequest = createDeferred<{ moverId: string; isFavorite: boolean }>();
    const removeRequest = createDeferred<{ moverId: string; isFavorite: boolean }>();
    vi.mocked(addFavoriteMover).mockReturnValueOnce(addRequest.promise);
    vi.mocked(removeFavoriteMover).mockReturnValueOnce(removeRequest.promise);
    const { result } = renderHook(() => useFavoriteMover(), {
      wrapper: createQueryClientWrapper(createTestQueryClient()),
    });

    act(() => result.current.mutate({ moverId: "mover-1", nextIsFavorite: true }));
    await waitFor(() => expect(addFavoriteMover).toHaveBeenCalledTimes(1));
    act(() => result.current.mutate({ moverId: "mover-1", nextIsFavorite: false }));
    await act(async () => addRequest.resolve({ moverId: "mover-1", isFavorite: true }));
    await waitFor(() => expect(removeFavoriteMover).toHaveBeenCalledTimes(1));
    await act(async () => removeRequest.resolve({ moverId: "mover-1", isFavorite: false }));
  });

  it("예상한 상태로 성공하면 목록 쿼리를 다시 요청하지 않는다", async () => {
    vi.mocked(addFavoriteMover).mockResolvedValue({ moverId: "mover-1", isFavorite: true });
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    const { result } = renderHook(() => useFavoriteMover(), {
      wrapper: createQueryClientWrapper(queryClient),
    });

    act(() => result.current.mutate({ moverId: "mover-1", nextIsFavorite: true }));
    await waitFor(() => expect(addFavoriteMover).toHaveBeenCalledTimes(1));
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
