import { prototypeMocks } from "@/lib/mock/prototype-data";

export const coacheeService = {
  async fetchCoaches(_coachee_id: number) {
    return {
      success: true,
      message: "Coaches carregados.",
      status: 200,
      data: await prototypeMocks.coaches(),
    };
  },

  async registerMentoring(_payload: { coach_identifier: string; coachee_id: number }) {
    return {
      success: true,
      message: "Mentoria vinculada no protótipo.",
      status: 200,
      data: { message: "ok" },
    };
  },

  async fetchSharedTools(_coachID: number, _coacheeID: number) {
    return {
      success: true,
      message: "Ferramentas compartilhadas carregadas.",
      status: 200,
      data: await prototypeMocks.sharedTools(),
    };
  },
};
