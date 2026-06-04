import { Body, Controller, Post } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { TestDto } from './dto/test.dto';

@Controller('api')
export class AppController {
  constructor(private readonly utilsService: UtilsService) {}

  @Post('test')
  handleTest(@Body() body: TestDto) {
    return { result: this.utilsService.double(body.num) };
  }
}
