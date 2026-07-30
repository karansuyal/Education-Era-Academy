// Config objects fed into <CrudPage />. Field keys match the backend's
// Create/Update pydantic schemas exactly (see backend/app/schemas/admin_content.py).

export const statsResource = {
  endpoint: '/admin/stats',
  title: 'Stats',
  description: 'The number strip on the homepage — e.g. "1,200+ students mentored".',
  singularName: 'stat',
  emptyItem: { num: '', label: '', order_index: 0 },
  fields: [
    { key: 'num', label: 'Number', type: 'text', placeholder: 'e.g. 1,200+' },
    { key: 'label', label: 'Label', type: 'text', span2: true, placeholder: 'e.g. students mentored' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
}

export const whyPointsResource = {
  endpoint: '/admin/why-points',
  title: 'Why Points',
  description: '"Why study with us" reasons.',
  singularName: 'point',
  emptyItem: { code: '', title: '', desc: '', order_index: 0 },
  fields: [
    { key: 'code', label: 'Code', type: 'text', placeholder: 'e.g. RN-01' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'desc', label: 'Description', type: 'textarea', span2: true },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
}

export const batchesResource = {
  endpoint: '/admin/batches',
  title: 'Batches',
  description: 'Course batches shown on the homepage.',
  singularName: 'batch',
  emptyItem: { code: '', title: '', desc: '', meta: [], featured: false, order_index: 0 },
  fields: [
    { key: 'code', label: 'Code', type: 'text', placeholder: 'e.g. BATCH / FND-9-10' },
    { key: 'title', label: 'Title', type: 'text' },
    { key: 'desc', label: 'Description', type: 'textarea', span2: true },
    { key: 'meta', label: 'Meta tags (comma separated)', type: 'stringList', span2: true, placeholder: 'Mon-Sat . 2 hrs/day, Weekly tests' },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
  columns: [
    { key: 'code', label: 'Code' },
    { key: 'title', label: 'Title' },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'order_index', label: 'Order' },
  ],
}

export const facultyResource = {
  endpoint: '/admin/faculty',
  title: 'Faculty',
  description: 'Teaching staff shown on the homepage.',
  singularName: 'faculty member',
  emptyItem: { initials: '', name: '', detail: '', order_index: 0 },
  fields: [
    { key: 'initials', label: 'Initials', type: 'text', placeholder: 'e.g. RS' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'detail', label: 'Detail', type: 'textarea', span2: true, placeholder: 'Qualifications, experience...' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
}

export const resultsResource = {
  endpoint: '/admin/results',
  title: 'Results',
  description: 'Student result highlights. Get permission before publishing a name.',
  singularName: 'result',
  emptyItem: { tag: '', name: '', exam: '', order_index: 0 },
  fields: [
    { key: 'tag', label: 'Tag', type: 'text', placeholder: 'e.g. AIR 412 or 98.2%' },
    { key: 'name', label: 'Student name', type: 'text' },
    { key: 'exam', label: 'Exam', type: 'text' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
}

export const testimonialsResource = {
  endpoint: '/admin/testimonials',
  title: 'Testimonials',
  description: 'Quotes from students/parents.',
  singularName: 'testimonial',
  emptyItem: { quote: '', author: '', order_index: 0 },
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', span2: true },
    { key: 'author', label: 'Author', type: 'text' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
}

export const galleryResource = {
  endpoint: '/admin/gallery',
  title: 'Gallery',
  description: 'Photo/video tiles for the gallery section.',
  singularName: 'gallery item',
  emptyItem: { type: 'image', label: '', caption: '', src: '', youtube_id: '', poster: '', order_index: 0 },
  fields: [
    { key: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
    { key: 'label', label: 'Label', type: 'text' },
    { key: 'caption', label: 'Caption', type: 'text', span2: true },
    { key: 'src', label: 'Image / self-hosted video path', type: 'text', span2: true, placeholder: '/classroom.jpg' },
    { key: 'youtube_id', label: 'YouTube ID (if video, no src)', type: 'text' },
    { key: 'poster', label: 'Video poster image', type: 'text' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
  columns: [
    { key: 'type', label: 'Type' },
    { key: 'label', label: 'Label' },
    { key: 'order_index', label: 'Order' },
  ],
}

export const faqsResource = {
  endpoint: '/admin/faqs',
  title: 'FAQs',
  description: 'Frequently asked questions.',
  singularName: 'FAQ',
  emptyItem: { q: '', a: '', order_index: 0 },
  fields: [
    { key: 'q', label: 'Question', type: 'text', span2: true },
    { key: 'a', label: 'Answer', type: 'textarea', span2: true },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
  columns: [
    { key: 'q', label: 'Question' },
    { key: 'order_index', label: 'Order' },
  ],
}

export const blogResource = {
  endpoint: '/admin/blog',
  title: 'Blog Posts',
  description: 'Announcements and notices — each gets its own page at /blog/<slug>.',
  singularName: 'post',
  emptyItem: { slug: '', date: '', title: '', excerpt: '', content: '', is_published: true },
  fields: [
    { key: 'title', label: 'Title', type: 'text', span2: true },
    { key: 'slug', label: 'Slug (URL)', type: 'text', placeholder: 'e.g. new-batch-announcement' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'excerpt', label: 'Excerpt (shown in list)', type: 'textarea', span2: true },
    { key: 'content', label: 'Full content', type: 'textarea', span2: true },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ],
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'date', label: 'Date' },
    { key: 'is_published', label: 'Published', type: 'checkbox' },
  ],
}

export const feePlansResource = {
  endpoint: '/admin/fee-plans',
  title: 'Fee Plans',
  description: 'Pricing cards for the Fees section.',
  singularName: 'fee plan',
  emptyItem: { name: '', price_full: '', price_emi: '', includes: [], featured: false, order_index: 0 },
  fields: [
    { key: 'name', label: 'Plan name', type: 'text' },
    { key: 'price_full', label: 'Full payment price', type: 'text', placeholder: 'Rs 12,000' },
    { key: 'price_emi', label: 'EMI price', type: 'text', placeholder: 'Rs 1,000 x 12 months' },
    { key: 'includes', label: "What's included (comma separated)", type: 'stringList', span2: true },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
    { key: 'order_index', label: 'Order', type: 'number' },
  ],
  columns: [
    { key: 'name', label: 'Plan' },
    { key: 'price_full', label: 'Full price' },
    { key: 'price_emi', label: 'EMI' },
    { key: 'featured', label: 'Featured', type: 'checkbox' },
  ],
}
