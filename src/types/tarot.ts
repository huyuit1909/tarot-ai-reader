export type TarotTopic =
  | "Tổng quan"
  | "Tình cảm"
  | "Sự nghiệp"
  | "Tài chính"
  | "Sức khỏe";

export type CardOrientation = "Upright" | "Reversed";

export interface TarotCardData {
  id: string;
  name: string;
}

export interface TarotReadingRequest {
  topic: TarotTopic;
  cardName: string;
  orientation: CardOrientation;
}

export interface TarotReadingResponse {
  summary: string;
  analysis: string;
  advice: string;
  affirmation: string;
}
