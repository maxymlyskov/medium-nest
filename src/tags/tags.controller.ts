import { Controller, Get } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
    constructor(private tagsService: TagsService) { }

    @Get()
    findAll(): string[] {
        return this.tagsService.findAll();
    }
}
