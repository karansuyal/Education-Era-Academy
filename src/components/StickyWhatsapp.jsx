import { siteInfo } from '../data/content'

export default function StickyWhatsapp() {
  const url = `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent('Hi, I want to know more about admissions at ' + siteInfo.name + ' ' + siteInfo.nameSuffix)}`

  return (
    <a
      className="sticky-whatsapp"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      ☏
    </a>
  )
}
