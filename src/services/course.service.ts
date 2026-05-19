import { prototypeMocks } from "@/lib/mock/prototype-data";

export const courseService = {
  async getAll() {
    const orders = await prototypeMocks.orders();
    const courses = orders.flatMap((order) =>
      order.products.map((product, index) => ({
        id: Number(`${order.id}${index + 1}`),
        nome: `${product.nome} - Trilha`,
        codigo: product.codigo ?? `PX-${order.id}-${index + 1}`,
        tipo: 1,
        service_type: 16,
        classificacao: 1,
      })),
    );

    return {
      success: true,
      message: "Cursos carregados.",
      status: 200,
      data: courses,
    };
  },
};
