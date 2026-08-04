import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

import AddressSelectModal, {
  type AddressItem,
} from "@/components/estimate/request/AddressSelectModal";

/**
 * NOTE: 실제 AddressSearchItem 타입 필드에 맞게 값을 조정해주세요.
 */
const mockAddressResults: AddressItem[] = [
  {
    id: "addr-1",
    zipCode: "06134",
    roadAddress: "서울 강남구 테헤란로 123",
    jibunAddress: "서울 강남구 역삼동 123-45",
  },
  {
    id: "addr-2",
    zipCode: "06134",
    roadAddress: "서울 강남구 테헤란로 456",
    jibunAddress: "서울 강남구 역삼동 456-78",
  },
] as unknown as AddressItem[];

/** window.fetch를 스텁으로 교체합니다. 각 play 시작부에서 호출해 이전 스토리의 mock이 남지 않게 합니다. */
function mockFetchOnce(options: { ok: boolean; results?: AddressItem[]; message?: string }) {
  const { ok, results = [], message } = options;
  window.fetch = fn(async () => ({
    ok,
    json: async () => (ok ? { results } : { message }),
  })) as unknown as typeof fetch;
}

const meta = {
  title: "Modal/Estimate/AddressSelectModal",
  component: AddressSelectModal,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "출발지·도착지 주소를 검색해 선택하는 모달입니다. `/api/address/search`를 호출하며, 스토리에서는 `window.fetch`를 스텁으로 대체해 테스트합니다.",
      },
    },
  },
  args: {
    open: true,
    kind: "출발지",
    onClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof AddressSelectModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: "검색 전 초기 상태입니다. 안내 문구가 표시됩니다." },
    },
  },
  play: async () => {
    const canvas = within(document.body);

    expect(canvas.getByText("주소를 검색하면 결과가 여기에 표시됩니다")).toBeInTheDocument();

    const confirmButton = canvas.getByRole("button", { name: "선택 완료" });
    expect(confirmButton).toBeDisabled();
  },
};

export const SearchWithResults: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "검색어를 입력하고 제출하면 결과 목록이 표시됩니다. 카드를 선택하면 버튼이 활성화됩니다.",
      },
    },
  },
  play: async ({ args }) => {
    mockFetchOnce({ ok: true, results: mockAddressResults });
    const canvas = within(document.body);

    const searchInput = canvas.getByPlaceholderText("주소를 검색해주세요");
    await userEvent.type(searchInput, "테헤란로{Enter}");

    await waitFor(() => {
      expect(canvas.getByText("서울 강남구 테헤란로 123")).toBeInTheDocument();
    });

    const confirmButton = canvas.getByRole("button", { name: "선택 완료" });
    expect(confirmButton).toBeDisabled();

    await userEvent.click(canvas.getByText("서울 강남구 테헤란로 123"));
    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });

    await userEvent.click(confirmButton);
    expect(args.onConfirm).toHaveBeenCalledWith(
      expect.objectContaining({ roadAddress: "서울 강남구 테헤란로 123" }),
    );
  },
};

export const SearchWithNoResults: Story = {
  parameters: {
    docs: {
      description: { story: "검색 결과가 없을 때 안내 문구가 표시됩니다." },
    },
  },
  play: async () => {
    mockFetchOnce({ ok: true, results: [] });
    const canvas = within(document.body);

    const searchInput = canvas.getByPlaceholderText("주소를 검색해주세요");
    await userEvent.type(searchInput, "존재하지않는주소{Enter}");

    await waitFor(() => {
      expect(
        canvas.getByText("검색 결과가 없습니다. 다른 주소로 검색해보세요."),
      ).toBeInTheDocument();
    });
  },
};

export const SearchError: Story = {
  parameters: {
    docs: {
      description: { story: "검색 요청이 실패하면 오류 메시지가 표시됩니다." },
    },
  },
  play: async () => {
    mockFetchOnce({ ok: false, message: "주소 검색에 실패했습니다." });
    const canvas = within(document.body);

    const searchInput = canvas.getByPlaceholderText("주소를 검색해주세요");
    await userEvent.type(searchInput, "테헤란로{Enter}");

    await waitFor(() => {
      expect(canvas.getByText("주소 검색에 실패했습니다.")).toBeInTheDocument();
    });
  },
};

export const ClearResetsSearch: Story = {
  parameters: {
    docs: {
      description: { story: "지우기 버튼을 누르면 검색어와 결과, 선택 상태가 초기화됩니다." },
    },
  },
  play: async () => {
    mockFetchOnce({ ok: true, results: mockAddressResults });
    const canvas = within(document.body);

    const searchInput = canvas.getByPlaceholderText("주소를 검색해주세요");
    await userEvent.type(searchInput, "테헤란로{Enter}");

    await waitFor(() => {
      expect(canvas.getByText("서울 강남구 테헤란로 123")).toBeInTheDocument();
    });

    const clearButton = canvas.getByRole("button", { name: /지우기|clear/i });
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(canvas.getByText("주소를 검색하면 결과가 여기에 표시됩니다")).toBeInTheDocument();
    });
  },
};
