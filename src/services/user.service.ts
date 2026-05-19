import type { ApiResult, UserAddress } from "@/types/domain";
import { prototypeMocks } from "@/lib/mock/prototype-data";

export type LoginDto = {
  email: string;
  password: string;
  remember_me?: boolean;
};

export type RefreshSessionDto = {
  refresh_token: string;
};

export type RegisterDto = {
  name: string;
  email: string;
  phone: string;
  document?: string;
  password: string;
};

export type AddressDto = {
  account_id: number;
  address: {
    address_id: number | null;
    street: string;
    district: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
    number: string;
    complement?: string;
  };
};

export type UpdatePasswordDto = {
  account_id: number;
  current_pass: string;
  new_pass: string;
};

export type UpdatePersonalInfoDto = {
  account_id: number;
  name?: string;
  document?: string;
  phone?: string;
  document_type?: "cpf";
};

export type SendMessageDto = {
  sender_id: number;
  receiver_id: number;
  content: string;
};

export type FetchMessagesDto = {
  sender_id: number;
  receiver_id: number;
};

export type ListNotificationDto = {
  account_id: number;
  page: number;
  limit: number;
};

export type ReadNotificationDto = {
  account_id: number;
  notification_id: number;
  read: boolean;
};

export const accountService = {
  async authenticate(data: LoginDto) {
    const preset = await prototypeMocks.login(data.email.trim().toLowerCase());

    return {
      success: true,
      message: "Acesso liberado no protótipo.",
      status: 200,
      data: {
        name: preset.user.name,
        email: preset.user.email,
        phone: preset.user.phone,
        document: preset.user.document,
        document_type: preset.user.document_type,
        photo: preset.user.photo,
        login_info: {
          id: preset.user.id,
          role: preset.user.role,
          accountable_type: preset.user.accountableType,
          accountable_id: preset.user.accountableId,
          customer_id: preset.user.customerId,
          coliseum_user_id: preset.user.coliseumUserId,
        },
        access_token: preset.accessToken,
        refresh_token: preset.refreshToken,
        access_token_expires_at: new Date(Date.now() + 86_400_000).toISOString(),
        refresh_token_expires_at: new Date(Date.now() + 7 * 86_400_000).toISOString(),
        remember_me: Boolean(data.remember_me),
      } satisfies Record<string, unknown>,
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async refreshSession(_data: RefreshSessionDto) {
    const preset = await prototypeMocks.refreshSession("customer");

    return {
      success: true,
      message: "Sessão atualizada.",
      status: 200,
      data: {
        access_token: preset.accessToken,
        refresh_token: preset.refreshToken,
        access_token_expires_at: new Date(Date.now() + 86_400_000).toISOString(),
        refresh_token_expires_at: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      } satisfies Record<string, unknown>,
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async logout(_data?: RefreshSessionDto) {
    return {
      success: true,
      message: "Sessão encerrada.",
      status: 200,
      data: {},
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async recoverPassword(email: string) {
    return {
      success: true,
      message: `Enviamos uma orientação para ${email.trim() || "o e-mail informado"}.`,
      status: 200,
      data: {},
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async register(data: RegisterDto) {
    return {
      success: true,
      message: `Conta demonstrativa criada para ${data.name.trim()}.`,
      status: 200,
      data: {},
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async showAddress(_account_id: number) {
    return {
      success: true,
      message: "Endereço carregado.",
      status: 200,
      data: await prototypeMocks.address(),
    } satisfies ApiResult<UserAddress>;
  },

  async updateAddress(_data: AddressDto) {
    return {
      success: true,
      message: "Endereço atualizado no protótipo.",
      status: 200,
      data: { message: "ok" },
    } satisfies ApiResult<{ message: string }>;
  },

  async updatePassword(_data: UpdatePasswordDto) {
    return {
      success: true,
      message: "Senha atualizada no protótipo.",
      status: 200,
      data: { message: "ok" },
    } satisfies ApiResult<{ message: string }>;
  },

  async updatePersonalInfo(_data: UpdatePersonalInfoDto) {
    return {
      success: true,
      message: "Dados atualizados no protótipo.",
      status: 200,
      data: { message: "ok" },
    } satisfies ApiResult<{ message: string }>;
  },

  async updateAvatar(_account_id: number, _file: File) {
    return {
      success: true,
      message: "Avatar trocado no protótipo.",
      status: 200,
      data: { message: "ok" },
    } satisfies ApiResult<{ message: string }>;
  },

  async sendMessage(data: SendMessageDto) {
    await prototypeMocks.sendMessage({
      id: 0,
      content: data.content,
      sender_id: data.sender_id,
      receiver_id: data.receiver_id,
      checked: false,
      created_at: new Date().toISOString(),
    });

    return {
      success: true,
      message: "Mensagem enviada.",
      status: 200,
      data: { message: "ok" },
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async fetchMessages(sender_id: number, receiver_id: number) {
    return {
      success: true,
      message: "Mensagens carregadas.",
      status: 200,
      data: await prototypeMocks.messages(sender_id, receiver_id),
    } satisfies ApiResult<Record<string, unknown>[]>;
  },

  async listNotifications(_data: ListNotificationDto) {
    return {
      success: true,
      message: "Notificações carregadas.",
      status: 200,
      data: await prototypeMocks.notifications(),
    } satisfies ApiResult<Record<string, unknown>>;
  },

  async updateNotification(data: ReadNotificationDto) {
    await prototypeMocks.markNotification(data.notification_id, data.read);
    return {
      success: true,
      message: "Notificação atualizada.",
      status: 200,
      data: { message: "ok" },
    } satisfies ApiResult<{ message: string }>;
  },

  readNotification(data: ReadNotificationDto) {
    return accountService.updateNotification(data);
  },
};
