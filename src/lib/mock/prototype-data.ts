import type {
  Classroom,
  Coach,
  Coachee,
  Message,
  Notification,
  Order,
  SessionUser,
  Tool,
  UserAddress,
  YouTubeVideo,
} from "@/types/domain";

type MockRole = SessionUser["role"];

type SessionPreset = {
  role: MockRole;
  user: SessionUser;
  accessToken: string;
  refreshToken: string;
};

type NotificationRecord = Notification & {
  account_notification_id: number;
  notification_id: number;
};

type MockState = {
  address: UserAddress;
  messages: Message[];
  notifications: NotificationRecord[];
  orders: Order[];
  classrooms: Classroom[];
  coaches: Coach[];
  coachees: Coachee[];
  tools: Tool[];
  videos: YouTubeVideo[];
  sessions: Record<MockRole, SessionPreset>;
};

const now = Date.now();

const isoMinutes = (minutes: number) =>
  new Date(now - minutes * 60_000).toISOString();

const isoDays = (days: number) =>
  new Date(now - days * 24 * 60 * 60_000).toISOString();

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const toTitle = (input: string) =>
  input
    .split(/[._\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

const defaultAddress: UserAddress = {
  address_id: 1,
  street: "Rua das Ideias",
  district: "Centro Criativo",
  zip_code: "01234-567",
  city: "São Paulo",
  state: "SP",
  country: "Brasil",
  number: "100",
  complement: "Sala 12",
};

const buildSession = (role: MockRole, fallbackEmail: string): SessionPreset => {
  const baseId =
    role === "coach"
      ? 1101
      : role === "coachee"
        ? 1201
        : role === "employee"
          ? 1301
          : 1401;
  const customerId = baseId + 500;
  const emailPrefix = fallbackEmail.split("@")[0] || role;

  return {
    role,
    accessToken: `${role}-access-token`,
    refreshToken: `${role}-refresh-token`,
    user: {
      id: baseId,
      profileId: baseId,
      name: `${toTitle(emailPrefix)} ${role === "employee" ? "Studio" : "Lab"}`,
      email: fallbackEmail,
      phone: "(11) 98888-1101",
      photo: undefined,
      role,
      accountableType: role === "customer" ? "Customer" : "User",
      accountableId: baseId,
      customerId,
      coliseumUserId: baseId + 900,
      address: clone(defaultAddress),
      document: "123.456.789-10",
      document_type: "cpf",
    },
  };
};

const buildTool = (id: number, name: string, description: string, type: string): Tool => ({
  id,
  name,
  description,
  tool_type: type,
  fields: [
    {
      id: id * 10 + 1,
      label: "O que você quer desenvolver?",
      description: "Descreva o foco principal.",
      field_type: "textarea",
      required: true,
      position: 1,
    },
    {
      id: id * 10 + 2,
      label: "Qual indicador vai acompanhar?",
      description: "Escolha um marcador simples de progresso.",
      field_type: "text",
      required: false,
      position: 2,
    },
  ],
});

const mockState: MockState = {
  address: defaultAddress,
  messages: [
    {
      id: 1,
      content: "Bem-vindo ao protótipo. Aqui tudo é simulado, mas navegável.",
      sender_id: 9000,
      receiver_id: 1401,
      checked: true,
      created_at: isoMinutes(320),
    },
    {
      id: 2,
      content: "Perfeito. Quero explorar os módulos e testar os fluxos.",
      sender_id: 1401,
      receiver_id: 9000,
      checked: true,
      created_at: isoMinutes(300),
    },
  ],
  notifications: [
    {
      account_notification_id: 1,
      notification_id: 501,
      id: 1,
      title: "Novo roteiro de estudo",
      body: "Seu painel recebeu uma trilha de aprendizado em 3 etapas.",
      read: false,
      created_at: isoMinutes(70),
    },
    {
      account_notification_id: 2,
      notification_id: 502,
      id: 2,
      title: "Resumo salvo",
      body: "O último exercício foi salvo com sucesso no seu histórico.",
      read: true,
      created_at: isoMinutes(260),
    },
  ],
  orders: [
    {
      id: 701,
      codigo: "PX-701",
      data_venda: isoDays(12),
      valor_total: "497.90",
      status: 8,
      products: [
        { id: 901, codigo: "M-101", nome: "Módulo Base", situacao: "ATIVO" },
        { id: 902, codigo: "M-202", nome: "Atividade Guiada", situacao: "ATIVO" },
      ],
      students: [
        {
          id: 1,
          nome: "Ana Silva",
          nome_cracha: "Ana",
          turma_id: "A1",
          produto_id: 901,
          confirmado: true,
          transferred: false,
        } as never,
      ],
      installments: [
        {
          id: 1,
          numero_parcela: 1,
          valor_parcela: "149.30",
          valor_total: "497.90",
          data_vencimento: isoDays(9),
          data_recebimento: isoDays(8),
          situacao: 5,
        },
        {
          id: 2,
          numero_parcela: 2,
          valor_parcela: "174.30",
          valor_total: "497.90",
          data_vencimento: isoDays(-21),
          data_recebimento: null,
          situacao: 1,
        },
      ],
    },
    {
      id: 702,
      codigo: "PX-702",
      data_venda: isoDays(3),
      valor_total: "197.00",
      status: 5,
      products: [
        { id: 903, codigo: "M-303", nome: "Atividade Reflexiva", situacao: "ATIVO" },
      ],
      students: [],
      installments: [],
    },
  ],
  classrooms: [
    {
      id: 301,
      nome: "Turma de Estudo 01",
      codigo: "TR-01",
      codigo_turma: "TR-01",
      product_code: "PX-701",
      status: 1,
      student: {
        id: 1,
        nome: "Ana Silva",
        nome_cracha: "Ana",
        turma_id: 301,
        produto_id: 901,
        confirmado: true,
        transferred: false,
        duplicate_count: 1,
        is_primary: true,
      } as never,
      students: [
        {
          id: 1,
          nome: "Ana Silva",
          nome_cracha: "Ana",
          turma_id: 301,
          produto_id: 901,
          confirmado: true,
          transferred: false,
          duplicate_count: 1,
          is_primary: true,
        } as never,
        {
          id: 2,
          nome: "Bruno Lima",
          nome_cracha: "Bruno",
          turma_id: 301,
          produto_id: 901,
          confirmado: false,
          transferred: false,
          duplicate_count: 2,
        } as never,
      ],
    },
    {
      id: 302,
      nome: "Turma de Estudo 02",
      codigo: "TR-02",
      codigo_turma: "TR-02",
      product_code: "PX-702",
      status: 2,
      student: {
        id: 3,
        nome: "Carla Rocha",
        nome_cracha: "Carla",
        turma_id: 302,
        produto_id: 903,
        confirmado: false,
        transferred: false,
        duplicate_count: 1,
      } as never,
      students: [] as never,
    },
  ],
  coaches: [
    { id: 2101, name: "Lia Moraes", email: "lia@studio.test", phone: "(11) 94444-2101" },
    { id: 2102, name: "Rafael Cruz", email: "rafael@studio.test", phone: "(11) 94444-2102" },
  ],
  coachees: [
    { id: 2201, name: "Camila Prado", email: "camila@studio.test", phone: "(11) 95555-2201" },
    { id: 2202, name: "Diego Alves", email: "diego@studio.test", phone: "(11) 95555-2202" },
  ],
  tools: [
    buildTool(42, "Roda de Aprendizado", "Ferramenta para mapear foco, ação e revisão.", "reflection"),
    buildTool(77, "Mapa de Hábitos", "Organize o próximo passo em rotinas objetivas.", "planning"),
    buildTool(101, "Pulse Check", "Levantamento rápido de percepção e clareza.", "check-in"),
  ],
  videos: [
    {
      id: "proto-101",
      title: "Como usar o protótipo para demonstrar aprendizado",
      description: "Um guia curto para navegar pelos módulos e apresentar a experiência.",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
      publishedAt: isoDays(2),
    },
    {
      id: "proto-202",
      title: "Aprendizado prático: do painel à ação",
      description: "Exemplo de conteúdo em vídeo para a vitrine do sistema.",
      thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      publishedAt: isoDays(8),
    },
    {
      id: "proto-303",
      title: "Frases da vida para uso didático no dia a dia",
      description: "Como o carrossel e as mensagens podem apoiar a experiência.",
      thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      publishedAt: isoDays(14),
    },
  ],
  sessions: {
    coach: buildSession("coach", "coach@studio.test"),
    coachee: buildSession("coachee", "coachee@studio.test"),
    customer: buildSession("customer", "customer@studio.test"),
    employee: buildSession("employee", "employee@studio.test"),
  },
};

const prototypeState = mockState;

export const prototypeMocks = {
  async login(email: string) {
    const normalized = email.trim().toLowerCase();
    const role: MockRole = normalized.includes("coach")
      ? "coach"
      : normalized.includes("coachee")
        ? "coachee"
        : normalized.includes("employee")
          ? "employee"
          : "customer";
    const preset = clone(prototypeState.sessions[role]);
    preset.user.email = normalized;
    preset.user.name = `${toTitle(normalized.split("@")[0] || role)} ${role === "employee" ? "Studio" : "Lab"}`;
    return preset;
  },

  async refreshSession(role: MockRole = "customer") {
    const preset = clone(prototypeState.sessions[role]);
    preset.accessToken = `${role}-access-token-${Date.now()}`;
    preset.refreshToken = `${role}-refresh-token-${Date.now()}`;
    return preset;
  },

  async address() {
    return clone(prototypeState.address);
  },

  async messages(senderId: number, receiverId: number) {
    return clone(
      prototypeState.messages.filter(
        (message) =>
          (message.sender_id === senderId && message.receiver_id === receiverId) ||
          (message.sender_id === receiverId && message.receiver_id === senderId),
      ),
    );
  },

  async sendMessage(message: Message) {
    prototypeState.messages.push({ ...message, id: prototypeState.messages.length + 1 });
    return { message: "Mensagem enviada com sucesso." };
  },

  async notifications() {
    const unread = prototypeState.notifications.filter((item) => !item.read).length;
    return {
      notifications: {
        data: clone(
          prototypeState.notifications.map((item) => ({
            id: item.account_notification_id,
            attributes: {
              notification_id: item.notification_id,
              title: item.title,
              body: item.body,
              read: item.read,
              created_at: item.created_at,
            },
          })),
        ),
      },
      meta: { unread_count: unread },
    };
  },

  async markNotification(notificationId: number, read: boolean) {
    prototypeState.notifications = prototypeState.notifications.map((item) =>
      item.account_notification_id === notificationId ? { ...item, read } : item,
    );
    return { message: "Notificação atualizada." };
  },

  async orders() {
    return clone(prototypeState.orders);
  },

  async classrooms() {
    return clone(prototypeState.classrooms);
  },

  async coaches() {
    return clone(prototypeState.coaches);
  },

  async coachees() {
    return clone(prototypeState.coachees);
  },

  async tools() {
    return clone(prototypeState.tools);
  },

  async toolById(id: number) {
    return clone(prototypeState.tools.find((tool) => tool.id === id) ?? prototypeState.tools[0]);
  },

  async sharedTools() {
    return clone(prototypeState.tools.slice(0, 2));
  },

  async toolAnswer(id: number) {
    const tool = prototypeState.tools.find((item) => item.id === id) ?? prototypeState.tools[0];
    return {
      tool_id: tool.id,
      answers: (tool.fields ?? []).map((field, index) => ({
        tool_field_id: field.id,
        value: index === 0 ? "Clareza e constância" : "80%",
      })),
    };
  },

  async videos(maxResults = 12) {
    return clone(prototypeState.videos.slice(0, maxResults));
  },

  async voucher(token: string) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
        <defs>
          <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#0f4c5c"/>
            <stop offset="100%" stop-color="#f4a261"/>
          </linearGradient>
        </defs>
        <rect width="1280" height="720" fill="url(#bg)"/>
        <rect x="72" y="72" width="1136" height="576" rx="40" fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.34)"/>
        <text x="120" y="220" fill="#fff" font-size="72" font-family="sans-serif" font-weight="700">Ingresso demonstrativo</text>
        <text x="120" y="320" fill="#fff" font-size="36" font-family="sans-serif">Token: ${token}</text>
        <text x="120" y="390" fill="#fff" font-size="30" font-family="sans-serif">O objetivo é mostrar a experiência visual do protótipo.</text>
        <text x="120" y="470" fill="#fff" font-size="26" font-family="sans-serif">Sistema de aprendizado, materiais e acompanhamento fake.</text>
      </svg>
    `.trim();

    return {
      blob: new Blob([svg], { type: "image/svg+xml" }),
      contentType: "image/svg+xml",
    };
  },
};
