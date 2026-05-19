export type UserRole = "coach" | "coachee" | "customer" | "employee";

export type UserAddress = {
  address_id?: number | null;
  street?: string;
  district?: string;
  zip_code?: string;
  city?: string;
  state?: string;
  country?: string;
  number?: string;
  complement?: string;
};

export type SessionUser = {
  id: number;
  profileId: number;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
  pushToken?: string;
  role: UserRole;
  accountableType?: "Customer" | "User";
  accountableId?: number;
  customerId?: number;
  coliseumUserId?: number;
  address?: UserAddress;
  document?: string;
  document_type?: "cpf" | "cnpj";
};

export type ApiResult<T> = {
  success: boolean;
  message: string;
  data: T | null;
  status: number;
  errorCode?: string;
};

export type ApiListResult<T> = ApiResult<T[]>;

export type OrderProduct = {
  id: number;
  codigo: string;
  nome: string;
  tipo?: string;
  situacao?: string;
};

export type OrderStudent = {
  id: number | string;
  nome?: string;
  nome_cracha?: string;
  codigo?: string | null;
  status?: number;
  confirmado?: boolean;
  turma_id?: number | string;
  produto_id?: number | string;
  cliente_id?: number | string;
  owner_id?: number | string | null;
};

export type OrderInstallment = {
  id: number | string;
  numero_parcela?: number;
  valor_parcela?: string | number;
  valor_total?: string | number;
  data_vencimento: string;
  data_recebimento?: string | null;
  situacao: number | string;
};

export type Order = {
  id: number;
  codigo: string;
  data_venda: string;
  valor_total: string | number;
  status: number;
  in_cancellation_process?: boolean;
  products: OrderProduct[];
  students: OrderStudent[];
  installments: OrderInstallment[];
};

export type Course = {
  id: number;
  nome: string;
  codigo: string;
  tipo: number;
  service_type: number;
  classificacao: number;
};

export type Coachee = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
};

export type Coach = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  photo?: string;
};

export type Mentoring = {
  id: number;
  coach_id: number;
  coachee_id: number;
};

export type ToolField = {
  id: number;
  label: string;
  description?: string;
  field_type: string;
  options?: string[];
  min_scale?: number;
  max_scale?: number;
  multiple?: boolean;
  required?: boolean;
  position?: number;
};

export type Tool = {
  id: number;
  name: string;
  description?: string;
  tool_type?: string;
  fields?: ToolField[];
};

export type ToolAnswer = {
  field_id: number;
  value: string | string[];
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};

export type Message = {
  id: number;
  content: string;
  sender_id: number;
  receiver_id: number;
  checked: boolean;
  created_at: string;
};

export type Classroom = {
  id: number | string;
  nome: string;
  codigo?: string;
  codigo_turma?: string;
  turma_id?: number | string;
  product_code?: string;
  data_inicio?: string;
  data_fim?: string;
  hora_inicio?: string;
  status?: string | number;
  student?: ClassroomStudent;
  students?: ClassroomStudent[];
};

export type ClassroomStudent = OrderStudent & {
  codigo?: string;
  voucher?: string;
  duplicate_count?: number;
  is_primary?: boolean;
  transferred: boolean;
};

export type YouTubeVideo = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
};
