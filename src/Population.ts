import Individual from './Individual';
import RouletteSelect from './RouletteSelect';

const POPULATION_SIZE = 200;
const PAIR_SIZE = 250;
const ELITE_RATE = 0.2;
const GENERATION_COUNT = 1000;

export default class Population {
  private individuals: Individual[];
  private pairs: [number, number][];
  private bestIndividual: Individual;
  public static nodes: [number, number][];

  constructor() {
    this.individuals = [...Array(POPULATION_SIZE)].map(() => new Individual());

    this.pairs = [...Array(POPULATION_SIZE - 1)].reduce((pairs, val, row) => {
      const columns = [...Array(POPULATION_SIZE - row - 1)].map(
        (noUse, column) => {
          return [row, column + row + 1] as [number, number];
        }
      );
      return [...pairs, ...columns];
    }, [] as [number, number][]);

    this.bestIndividual = this.individuals.reduce((pre, cur) =>
      cur.score < pre.score ? cur : pre
    );
  }

  public start(): void {
    [...Array(GENERATION_COUNT - 1)].forEach((noUse, index) => {
      console.log(`第${index + 1}世代`);
      console.log(this.bestIndividual);
      const hugeIndividuals = this.crossover().sort(
        (a, b) => a.score - b.score
      );
      const [elites, remain] = Population.eliteSelect(hugeIndividuals);
      const rouletteCount =
        POPULATION_SIZE - Math.floor(POPULATION_SIZE * ELITE_RATE);
      const rouletteSelect = new RouletteSelect(remain, rouletteCount);
      this.individuals = [...elites, ...rouletteSelect.result];
      [this.bestIndividual] = elites;
    });
  }

  public get result(): Individual {
    return this.bestIndividual;
  }

  private crossover(): Individual[] {
    let pairs = [...this.pairs];
    const children = [...Array(PAIR_SIZE)].reduce((individuals) => {
      const pairIndex = Math.floor(pairs.length * Math.random());
      const [parent1Index, parent2Index] = pairs[pairIndex];
      const parent1 = this.individuals[parent1Index];
      const parent2 = this.individuals[parent2Index];
      const division = Math.floor(Population.nodes.length * Math.random());
      const child1 = new Individual(parent1, parent2, division);
      const child2 = new Individual(parent2, parent1, division);
      pairs = [
        ...pairs.slice(0, pairIndex),
        ...pairs.slice(pairIndex + 1, pairs.length),
      ];
      return [...individuals, child1, child2];
    }, [] as Individual[]);
    return [...this.individuals, ...children];
  }

  private static eliteSelect(
    hugeIndividuals: Individual[]
  ): [Individual[], Individual[]] {
    const eliteCount = Math.floor(POPULATION_SIZE * ELITE_RATE);
    const elites = hugeIndividuals.slice(0, eliteCount);
    const remain = hugeIndividuals.slice(eliteCount, hugeIndividuals.length);
    return [elites, remain];
  }
}
