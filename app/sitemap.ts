import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nutricionistamarialuisa.vercel.app";
  const lastModified = new Date();

  return [
    { url: baseUrl,                          lastModified, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/productos`,           lastModified, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/reservar-cita`,       lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/empresas`,            lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/comprar-libro`,       lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/nutri-kids`,          lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/nutri-kids/michi`,             lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/nutri-kids/atrapa-saludable`,  lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/nutri-kids/trivia`,            lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/nutri-kids/nutri-batalla`,     lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/dieta-basica`,        lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/dieta-vip`,           lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/dieta-premium`,       lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/promotores`,          lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/terminos`,            lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/privacidad`,          lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
