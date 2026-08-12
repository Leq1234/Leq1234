export interface Book {
  id: string;
  name: string;
  icon: string;
  color: string;
  isArchived: boolean;
  createdAt: number;
}

export interface BookInput {
  name: string;
  icon: string;
  color: string;
}