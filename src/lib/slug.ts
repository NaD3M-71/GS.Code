// "Bolsa de Trabajo (v2)" -> "bolsa-de-trabajo-v2"
export const slugify = (texto: string) =>
  texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // saca tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
