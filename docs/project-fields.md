# Project fields

Este documento describe los campos de un project obtenido desde la API o creado
desde Admin. La forma principal es `RawProject`, porque es el objeto que Admin
edita, guarda y recibe desde `/projects`.

La UI publica no usa `RawProject` directamente: lo transforma a `Project` con
`mapProject`. En esa vista derivada, el titulo aparece como `data.tittle`
porque ese typo ya existe en el tipo actual.

## RawProject

```ts
interface RawProject {
  id?: string;
  slug: string;
  publishedAt?: string | null;
  shared: {
    title?: string;
    coverImageSrc?: string;
    backgroundImage?: string;
    status?: string;
    type?: string;
    technologies?: string;
    buttons?: RawProjectButton[];
  };
  translations: RawProjectTranslation[];
  sections?: RawProjectSection[];
}
```

### Campos principales

| Campo          | Tipo                           | Descripcion                                                      |
| -------------- | ------------------------------ | ---------------------------------------------------------------- |
| `id`           | `string` opcional              | Identificador devuelto por la API. Admin no lo envia al guardar. |
| `slug`         | `string`                       | Identificador usado en URLs y rutas de edicion.                  |
| `publishedAt`  | `string \| null` opcional      | Fecha ISO de publicacion. Si es `null`, el project es draft.     |
| `shared`       | `object`                       | Datos globales compartidos por todos los idiomas.                |
| `translations` | `RawProjectTranslation[]`      | Textos por locale.                                               |
| `sections`     | `RawProjectSection[]` opcional | Secciones de detalle del project.                                |

### shared

| Campo             | Tipo                          | Ejemplo                                |
| ----------------- | ----------------------------- | -------------------------------------- |
| `title`           | `string` opcional             | `Stream OS`                            |
| `coverImageSrc`   | `string` opcional             | `https://example.com/stream-cover.jpg` |
| `backgroundImage` | `string` opcional             | `https://example.com/stream-bg.jpg`    |
| `status`          | `string` opcional             | `Live`                                 |
| `type`            | `string` opcional             | `Web App`                              |
| `technologies`    | `string` opcional             | `React, TypeScript`                    |
| `buttons`         | `RawProjectButton[]` opcional | Botones de preview, GitHub o docs.     |

`technologies` es una cadena separada por comas. La card publica la usa para
mostrar iconos de tecnologias.

## Buttons

```ts
interface RawProjectButton {
  icon?: string;
  url?: string;
  translations?: {
    locale: "en-us" | "es-mx" | "pt-br";
    text?: string;
  }[];
}
```

| Campo          | Tipo              | Ejemplo                         |
| -------------- | ----------------- | ------------------------------- |
| `icon`         | `string` opcional | `preview`, `github`, `docs`     |
| `url`          | `string` opcional | `https://example.com/stream-os` |
| `translations` | `array` opcional  | Labels del boton por idioma.    |

## Translations

```ts
interface RawProjectTranslation {
  locale: "en-us" | "es-mx" | "pt-br";
  subtitle?: string;
  tags?: string;
}
```

| Campo      | Tipo                            | Ejemplo                                                   |
| ---------- | ------------------------------- | --------------------------------------------------------- |
| `locale`   | `"en-us" \| "es-mx" \| "pt-br"` | `en-us`                                                   |
| `subtitle` | `string` opcional               | `A real-time analytics dashboard with sub-100ms updates.` |
| `tags`     | `string` opcional/legacy        | `#react #typescript #realtime`                            |

`tags` aparece en los proyectos de prueba/fallback dentro de `translations[]`,
pero el editor Admin actual no lo edita ni lo envia como campo tipado principal.

## Sections

```ts
interface RawProjectSection {
  id?: string;
  flexDirection?: string;
  coverImage?: string;
  translations?: {
    locale: "en-us" | "es-mx" | "pt-br";
    summary?: string;
    readMore?: string;
    modalContent?: string;
    close?: string;
  }[];
}
```

| Campo           | Tipo              | Ejemplo                                                          |
| --------------- | ----------------- | ---------------------------------------------------------------- |
| `id`            | `string` opcional | Identificador devuelto por la API. Admin no lo envia al guardar. |
| `flexDirection` | `string` opcional | `row` o `row-reverse`                                            |
| `coverImage`    | `string` opcional | `https://example.com/section.jpg`                                |
| `translations`  | `array` opcional  | Contenido de la seccion por idioma.                              |

## Payload que Admin envia a la API

Cuando Admin crea o actualiza un project, aplana `shared` antes de enviarlo al
backend. Tambien elimina `id` de project y sections.

```ts
{
  slug: project.slug,
  publishedAt: project.publishedAt ?? null,
  coverImageSrc: project.shared?.coverImageSrc ?? "",
  backgroundImage: project.shared?.backgroundImage ?? "",
  status: project.shared?.status ?? "",
  type: project.shared?.type ?? "",
  title: project.shared?.title ?? "",
  technologies: project.shared?.technologies ?? "",
  translations: project.translations,
  buttons: project.shared?.buttons ?? [],
  sections: (project.sections ?? []).map((section) => ({
    flexDirection: section.flexDirection ?? "row",
    coverImage: section.coverImage ?? "",
    translations: section.translations ?? []
  }))
}
```

## Ejemplo ordenado

```md
Title: Stream OS
Subtitle: A real-time analytics dashboard with sub-100ms updates.
Tags: #react #typescript #realtime
Cover image: https://example.com/images/stream-cover.jpg
Background/Banner: https://example.com/images/stream-bg.jpg
Status: Live
Type: Web App
Technologies: React, TypeScript
Buttons:

- See preview: https://example.com/stream-os
- Source code: https://github.com/example/stream-os
  Sections:
- Summary: Live metrics, fast updates, and workflow-focused dashboards.
```

## JSON equivalente

```json
{
  "slug": "stream-os",
  "publishedAt": "2026-03-18T00:00:00.000Z",
  "shared": {
    "title": "Stream OS",
    "coverImageSrc": "https://example.com/images/stream-cover.jpg",
    "backgroundImage": "https://example.com/images/stream-bg.jpg",
    "status": "Live",
    "type": "Web App",
    "technologies": "React, TypeScript",
    "buttons": [
      {
        "icon": "preview",
        "url": "https://example.com/stream-os",
        "translations": [
          {
            "locale": "en-us",
            "text": "See preview"
          },
          {
            "locale": "es-mx",
            "text": "Ver vista previa"
          },
          {
            "locale": "pt-br",
            "text": "Ver previa"
          }
        ]
      },
      {
        "icon": "github",
        "url": "https://github.com/example/stream-os",
        "translations": [
          {
            "locale": "en-us",
            "text": "Source code"
          },
          {
            "locale": "es-mx",
            "text": "Codigo fuente"
          },
          {
            "locale": "pt-br",
            "text": "Codigo fonte"
          }
        ]
      }
    ]
  },
  "translations": [
    {
      "locale": "en-us",
      "subtitle": "A real-time analytics dashboard with sub-100ms updates.",
      "tags": "#react #typescript #realtime"
    },
    {
      "locale": "es-mx",
      "subtitle": "Dashboard de analytics en tiempo real con actualizaciones sub-100ms.",
      "tags": "#react #typescript #realtime"
    },
    {
      "locale": "pt-br",
      "subtitle": "Dashboard de analytics em tempo real com atualizacoes sub-100ms.",
      "tags": "#react #typescript #realtime"
    }
  ],
  "sections": [
    {
      "flexDirection": "row",
      "coverImage": "https://example.com/images/stream-section.jpg",
      "translations": [
        {
          "locale": "en-us",
          "summary": "Live metrics, fast updates, and workflow-focused dashboards.",
          "readMore": "Read more",
          "modalContent": "Stream OS centralizes real-time project signals in one dashboard.",
          "close": "X"
        },
        {
          "locale": "es-mx",
          "summary": "Metricas en vivo, actualizaciones rapidas y dashboards enfocados en flujo de trabajo.",
          "readMore": "Leer mas",
          "modalContent": "Stream OS centraliza senales de proyecto en tiempo real en un solo dashboard.",
          "close": "X"
        },
        {
          "locale": "pt-br",
          "summary": "Metricas ao vivo, atualizacoes rapidas e dashboards focados em fluxo de trabalho.",
          "readMore": "Ler mais",
          "modalContent": "Stream OS centraliza sinais de projeto em tempo real em um unico dashboard.",
          "close": "X"
        }
      ]
    }
  ]
}
```

## Project derivado para la UI

Despues de `mapProject(rawProject, locale)`, la UI recibe:

```ts
interface Project {
  slug: string;
  publishedAt?: string | null;
  data: {
    coverImageSrc?: string;
    status: string;
    type: string;
    tittle: string;
    subtitle: string;
    technologies: string;
    date: string;
    buttons: ProjectButton[];
  };
  header: {
    backgroundImage?: string;
    subtitle: string;
    buttons: ProjectButton[];
  };
  sections: {
    flexDirection?: string;
    coverImage?: string;
    tmContent: {
      summary: string;
      readMore: string;
      modalContent: string;
      close: string;
    };
  }[];
}
```

En esta vista, `buttons` ya queda resuelto al idioma elegido:

````ts
interface ProjectButton {
  text: string;
  icon?: string;
  url?: string;
}
```♦
````
