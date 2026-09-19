import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nutricionistamarialuisa.vercel.app";
  const lastModified = new Date();

  return [
    { url: baseUrl,                                    lastModified, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/comprar-libro/nutricion-del-bebe`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/productos`,                     lastModified, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/reservar-cita`,                 lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/calculadora-imc`,               lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/terminos`,                      lastModified, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/privacidad`,                    lastModified, changeFrequency: "yearly",  priority: 0.3 },
  ];
}
