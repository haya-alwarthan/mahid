import { Step } from './step.model';

export class StepDetails {
  id: number;
  step: Step;
  content: string;
  resources: string[];
  vids: string[];

  constructor(
    id: number,
    content: string,
    step: Step,
    resources: string[],
    vids: string[]
  ) {
    this.id = id;
    this.content = content;
    this.step = step;
    this.resources = resources;
    this.vids = vids;
  }
}
