
export type BlockType =
  | "hero" | "profile" | "cta" | "contact"
  | "text" | "gallery" | "video" | "divider"

export interface Section {
  id: string
  type: BlockType
  data: Record<string, any>
}

export interface LandingPageData {
  id: string
  slug: string
  title: string
  type: "nfc_staff" | "campaign"
  sections: Section[]
  theme: string
  isActive: boolean
  isIndexed: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}
