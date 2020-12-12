import Population from './Population';

const nodes: [number, number][] = [
  [23, 39],
  [8, 44],
  [34, 36],
  [12, 30],
  [42, 37],
  [6, 35],
  [1, 15],
  [12, 25],
  [4, 39],
  [13, 42],
  [23, 13],
  [7, 39],
  [11, 5],
  [6, 44],
  [28, 45],
  [10, 7],
  [3, 16],
  [4, 19],
  [3, 39],
  [0, 2],
  [19, 21],
  [5, 43],
  [8, 34],
  [20, 39],
  [2, 50],
  [20, 26],
  [16, 36],
  [24, 30],
  [9, 40],
  [5, 22],
  [30, 35],
  [2, 0],
  [21, 36],
  [22, 28],
  [3, 33],
  [11, 36],
  [14, 34],
];
// 202.37;
Population.nodes = nodes;
const population = new Population();
population.start();
console.log('最終世代');
console.log(population.result);
