export interface Point {
  time: number;
  amount: number;
}

export type PointHistory = Point[];

export interface Team {
  id: number;
  name: string;
  point: number;
  history: PointHistory;
  button_id: null | string;
}
