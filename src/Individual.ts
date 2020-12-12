import Population from './Population';

const MUTATION_RATE = 0.03;

export default class Individual {
  private fieldChromosome: number[];
  private fieldScore: number;

  constructor(...parents: [Individual, Individual, number] | []) {
    this.fieldChromosome = [];
    if (parents.length === 0) {
      this.setRandomGenes();
      this.fieldScore = this.calcScore();
    } else {
      this.orderCrossover(...parents);
      if (Math.random() < MUTATION_RATE) {
        this.spontaneousMutation();
      }
      this.fieldScore = this.calcScore();
    }
  }

  public get chromosome(): number[] {
    return [...this.fieldChromosome];
  }

  public get score(): number {
    return this.fieldScore;
  }

  private setRandomGenes(): void {
    let genes = Population.nodes.map((val, index) => index);
    while (genes.length > 0) {
      const r = Math.floor(genes.length * Math.random());
      this.fieldChromosome.push(genes[r]);
      genes = [...genes.slice(0, r), ...genes.slice(r + 1, genes.length)];
    }
  }

  private orderCrossover(
    mother: Individual,
    father: Individual,
    division: number
  ): void {
    const former = mother.chromosome.slice(0, division);
    const latter = father.chromosome.reduce((genes, gene) => {
      if (former.includes(gene)) {
        return [...genes];
      }
      return [...genes, gene];
    }, [] as number[]);
    this.fieldChromosome = [...former, ...latter];
  }

  private spontaneousMutation(): void {
    const a = Math.floor(this.fieldChromosome.length * Math.random());
    let b = a;
    while (b === a) {
      b = Math.floor(this.fieldChromosome.length * Math.random());
    }
    const index1 = a < b ? a : b;
    const index2 = a < b ? b : a;
    this.fieldChromosome = [
      ...this.fieldChromosome.slice(0, index1),
      ...this.fieldChromosome.slice(index1, index2 + 1).reverse(),
      ...this.fieldChromosome.slice(index2 + 1, this.fieldChromosome.length),
    ];
  }

  private calcScore(): number {
    return this.fieldChromosome.reduce((score, curGene, index, genes) => {
      const nextGene = index < genes.length - 1 ? genes[index + 1] : genes[0];
      return score + Individual.calcDistance(curGene, nextGene);
    }, 0);
  }

  private static calcDistance(gene1: number, gene2: number) {
    const [x1, y1] = Population.nodes[gene1];
    const [x2, y2] = Population.nodes[gene2];
    const x = x1 - x2;
    const y = y1 - y2;
    return Math.sqrt(x * x + y * y);
  }
}
