import {defineField, defineType} from 'sanity'

export const productType = defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().error('El nombre es obligatorio.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'name', // Genera el slug a partir del campo 'name'
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('El slug es obligatorio.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'reference',
      to: {type: 'category'},
      validation: (Rule) => Rule.required().error('La categoría es obligatoria'),
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).error('El precio debe ser un número positivo.'),
    }),
    defineField({
      name: 'stock',
      title: 'Stock disponible',
      type: 'number',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).integer().error('El stock debe ser un número entero positivo.'),
    }),
    defineField({
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true, // Permite seleccionar el punto focal de la imagen
      },
      validation: (Rule) => Rule.required().error('La imagen es obligatoria.'),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
    }),
  ],
}) 