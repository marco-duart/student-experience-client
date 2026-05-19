type ProductVisualGroup = {
  label: string;
  miniDescription: string;
  ids: number[];
};

export type ProductVisual = {
  label: string;
  miniDescription: string;
};

const visualGroups: ProductVisualGroup[] = [
  {
    label: "Produto",
    miniDescription:
      "Uma jornada curta para apresentar o produto, seus objetivos e o valor da experiência de forma clara e neutra.",
    ids: [159, 268, 277, 284],
  },
  {
    label: "Produto",
    miniDescription:
      "Conteúdo demonstrativo para explicar lógica, etapas e aplicação sem depender de uma marca específica.",
    ids: [2, 42, 47, 71, 77, 266],
  },
  {
    label: "Produto",
    miniDescription:
      "Recorte didático para apresentar um módulo de estudo, avaliação e revisão de conceitos.",
    ids: [27, 31, 52],
  },
  {
    label: "Produto",
    miniDescription:
      "Texto enxuto para demonstrar como o produto pode ser apresentado em um catálogo online.",
    ids: [38],
  },
  {
    label: "Produto",
    miniDescription:
      "Uma vitrine de apresentação de conteúdo para explicar um módulo ou trilha de aprendizado.",
    ids: [367],
  },
  {
    label: "Produto",
    miniDescription:
      "Material neutro para explicar benefícios, etapas e resultados de forma visual.",
    ids: [3, 439, 481],
  },
  {
    label: "Produto",
    miniDescription:
      "Página demonstrativa para conteúdo de aprendizado com linguagem clara e sem referências corporativas.",
    ids: [7, 438, 482],
  },
  {
    label: "Produto",
    miniDescription:
      "Estrutura simples para mostrar uma funcionalidade do protótipo com foco em aprendizado.",
    ids: [177],
  },
  {
    label: "Produto",
    miniDescription: "Fortaleça visão sistêmica para organizar o aprendizado com consistência.",
    ids: [69, 85, 371],
  },
  {
    label: "Produto",
    miniDescription: "Formato dinâmico com aplicação imediata e leitura objetiva.",
    ids: [5, 369],
  },
  {
    label: "Produto",
    miniDescription:
      "Texto-base para demonstração de trilha didática e navegação entre módulos.",
    ids: [10, 15, 19, 30, 46, 87, 426, 536, 538],
  },
  {
    label: "Produto",
    miniDescription:
      "Uma página de apoio para mostrar conteúdo educacional em uma vitrine comercial.",
    ids: [331],
  },
  {
    label: "Produto",
    miniDescription:
      "Base para apresentar conceitos, anotações e próximas ações sem marcas externas.",
    ids: [126, 128],
  },
  {
    label: "Produto",
    miniDescription:
      "Uma vitrine leve para destacar repertório, estudo e aplicação prática.",
    ids: [11, 142, 374, 455],
  },
];

const productVisuals: Record<number, ProductVisual> = visualGroups.reduce(
  (acc, group) => {
    group.ids.forEach((id) => {
      acc[id] = {
        image: group.image,
        miniDescription: group.miniDescription,
      };
    });
    return acc;
  },
  {} as Record<number, ProductVisual>,
);

export const fallbackProductVisual: ProductVisual = {
  label: "Produto",
  miniDescription: "Uma trilha demonstrativa com foco em evolução contínua.",
};

export const getProductVisualById = (id?: number): ProductVisual => {
  if (!id) return fallbackProductVisual;
  return productVisuals[id] ?? fallbackProductVisual;
};
