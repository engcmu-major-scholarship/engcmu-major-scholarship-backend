import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Advisor } from 'src/models/advisor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdvisorService {
  constructor(
    @InjectRepository(Advisor)
    private readonly advisorRepository: Repository<Advisor>,
  ) {}

  async getAdvisors() {
    const advisors = await this.advisorRepository.find();
    return advisors.map((advisor) => ({
      id: advisor.id,
      name: advisor.name,
    }));
  }
}
