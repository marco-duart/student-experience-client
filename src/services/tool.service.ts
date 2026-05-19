import { prototypeMocks } from "@/lib/mock/prototype-data";

export const toolService = {
  async getById(id: number) {
    return {
      success: true,
      message: "Ferramenta carregada.",
      status: 200,
      data: await prototypeMocks.toolById(id),
    };
  },

  async getByIds(ids: number[]) {
    const tools = await prototypeMocks.tools();
    return {
      success: true,
      message: "Ferramentas carregadas.",
      status: 200,
      data: tools.filter((tool) => ids.includes(tool.id)),
    };
  },

  async fetchByMentoring(_coachID: number, _coacheeID: number) {
    return {
      success: true,
      message: "Ferramentas da mentoria carregadas.",
      status: 200,
      data: await prototypeMocks.sharedTools(),
    };
  },

  async fetchToolAnswer(payload: {
    coach_id: number;
    coachee_id: number;
    tool_id: number;
  }) {
    return {
      success: true,
      message: "Respostas carregadas.",
      status: 200,
      data: await prototypeMocks.toolAnswer(payload.tool_id),
    };
  },

  async sendAnswer(_payload: {
    coach_id: number;
    coachee_id: number;
    tool_id: number;
    answers: unknown[];
  }) {
    return {
      success: true,
      message: "Respostas salvas no protótipo.",
      status: 200,
      data: { message: "ok" },
    };
  },
};
