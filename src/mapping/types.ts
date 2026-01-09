export type Row = {
  x: number; // -1..1 (or any range)
  y: number; // -1..1 (or any range)
  energy: number; // 0..1 (or any range)
  cluster: number; // integer
  t?: number; // optional time/order
};
