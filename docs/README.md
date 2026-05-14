# docs/

Esta carpeta contiene todos los documentos del Trabajo de Graduación.

## Convención de nombres

| Tipo | Prefijo |
|---|---|
| Transcripción de visita | `transcripcion-visita-NN.pdf` |
| Acta de reunión con tutor | `acta-reunion-tutor-NN.pdf` |
| Borradores de diagnóstico | `diagnostico-borrador-vN.pdf` |
| Marco metodológico | `marco-metodologico-vN.pdf` |
| Propuesta oficial | `propuesta-investigacion.pdf` |

## Cómo agregar un documento

1. Nombra el archivo siguiendo la convención.
2. Cópialo en esta carpeta.
3. Abre `app.js` y agrega una entrada al arreglo `DOCS` con los campos:
   - `id`, `icon`, `name`, `category`, `date`, `author`, `tag`, `href`, `summary`

## Categorías válidas
- `diagnostico`
- `transcripcion`
- `reunion`
- `otro`
