export interface Flashcard {
  _id?: string;
  forwardText: string;
  backwardText: string;
  userID: string;
  createdAt: Date;
  updatedAt: Date;
}
