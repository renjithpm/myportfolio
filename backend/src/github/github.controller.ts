import { Controller, Get } from '@nestjs/common';
import { GithubService, ContributionsPayload } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('contributions')
  getContributions(): Promise<ContributionsPayload> {
    return this.githubService.getContributions();
  }
}
