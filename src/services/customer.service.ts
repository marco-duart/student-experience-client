import { prototypeMocks } from "@/lib/mock/prototype-data";

export const customerService = {
  async fetchClassrooms(_customer_id: number) {
    return {
      success: true,
      message: "Turmas carregadas.",
      status: 200,
      data: await prototypeMocks.classrooms(),
    };
  },

  async fetchOrders(_customer_id: number) {
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

  async transferStudent(
    student_id: string | number,
    data: {
      nome: string;
      cpf?: string;
      email: string;
      telefone: string;
      tipo_cliente?: string;
    },
  ) {
    if (!data) {
      return {
        success: false,
        message: "Dados de transferência não informados.",
        status: 400,
        data: null,
      };
    }

    return {
      success: true,
      message: `Aluno ${student_id} transferido no protótipo.`,
      status: 200,
      data: { message: "ok" },
    };
  },

  async callConsultant(payload: {
    name: string;
    phone: string;
    email: string;
    send_vd: boolean;
  }) {
    return {
      success: true,
      message: `Solicitação recebida para ${payload.name}.`,
      status: 200,
      data: { message: "ok" },
    };
  },

  async fetchVoucherFile(token: string) {
    if (!token) {
      return { success: false, message: "Token do ingresso não informado." };
    }

    const file = await prototypeMocks.voucher(token);
    return {
      success: true,
      blob: file.blob,
      contentType: file.contentType,
    };
  },
};
