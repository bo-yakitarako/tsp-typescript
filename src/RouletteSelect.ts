import Individual from './Individual';

export default class RouletteSelect {
  private remain: Individual[];
  private fitnesses: number[];
  private fitnessSum: number;
  private selection: Individual[];

  constructor(remain: Individual[], count: number) {
    this.remain = [...remain];
    this.fitnesses = this.convertToFitness();
    this.fitnessSum = this.fitnesses.reduce((pre, cur) => pre + cur, 0);
    this.selection = this.select(count);
  }

  public get result(): Individual[] {
    return this.selection;
  }

  private convertToFitness(): number[] {
    const minScore = this.remain[this.remain.length - 1].score;
    const diff = this.remain[0].score - minScore;
    const max = 10;
    const min = 1;
    return this.remain.map(
      ({ score }) => ((score - minScore) / diff) * (max - min) + min
    );
  }

  private select(count: number): Individual[] {
    return [...Array(count)].map(() => {
      const selectIndex = this.getSelectIndex();
      this.fitnessSum -= this.fitnesses[selectIndex];
      this.fitnesses = [
        ...this.fitnesses.slice(0, selectIndex),
        ...this.fitnesses.slice(selectIndex + 1, this.fitnesses.length),
      ];
      const selectedIndividual = this.remain[selectIndex];
      this.remain = [
        ...this.remain.slice(0, selectIndex),
        ...this.remain.slice(selectIndex + 1, this.remain.length),
      ];
      return selectedIndividual;
    });
  }

  private getSelectIndex(): number {
    const randomValue = this.fitnessSum * Math.random();
    let currentSum = 0;
    for (let i = 0; i < this.fitnesses.length; i += 1) {
      const preSum = currentSum;
      currentSum += this.fitnesses[i];
      if (preSum <= randomValue && randomValue < currentSum) {
        return i;
      }
    }
    return this.fitnesses.length - 1;
  }
}
