import { prototypeMocks } from "@/lib/mock/prototype-data";

export type CallConsultantDTO = {
  name: string;
  phone: string;
  email: string;
  send_vd: boolean;
};

export const coachService = {
  async firstAccess(payload: {
    accountable_type: "Customer";
    accountable_id: number;
  }) {
    return {
      success: true,
      message: `Acesso inicial habilitado para o ID ${payload.accountable_id}.`,
      status: 200,
      data: { message: "ok" },
    };
  },

  async fetchClassrooms(_client_id: number) {
    return {
      success: true,
      message: "Turmas carregadas.",
      status: 200,
      data: await prototypeMocks.classrooms(),
    };
  },

  async fetchCoachees(_coach_id: number) {
    return {
      success: true,
      message: "Coachees carregados.",
      status: 200,
      data: await prototypeMocks.coachees(),
    };
  },

  async shareTool(_payload: {
    coach_id: number;
    tool_id: number;
    coachee_ids: number[];
  }) {
    return {
      success: true,
      message: "Ferramenta compartilhada no protótipo.",
      status: 200,
      data: { message: "ok" },
    };
  },

  async callConsultant(payload: CallConsultantDTO) {
    return {
      success: true,
      message: `Pedido enviado para ${payload.name}.`,
      status: 200,
      data: { message: "ok" },
    };
  },

  async fetchOrders(_id: number) {
    return {
      success: true,
      message: "Pedidos carregados.",
      status: 200,
      data: await prototypeMocks.orders(),
    };
  },

  async confirmStudent(student_id: number) {
    return {
      success: true,
      message: `Aluno ${student_id} confirmado no protótipo.`,
      status: 200,
      data: { message: "ok" },
    };
  },
};
