export interface TaskInterface {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  boardId: string;
  columnId: string;
}
