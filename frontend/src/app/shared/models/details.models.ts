import { Step } from './step.model';

export class StepDetails {
  id: number;
  content: string='';
  resources: string[];
  videos: string[];
  // people: string[];
  keywords: string[];

  constructor(
    id: number,
    content: string,
    resources: string[],
    videos: string[],
    // people: string[],
    keywords: string[]
  ) {
    this.id = id;
    this.content = content;
    this.resources = resources;
    this.videos = videos;
    // this.people = people;
    this.keywords = keywords;
  }


}
