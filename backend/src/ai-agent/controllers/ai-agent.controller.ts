import { Body, Controller, Param, Post, Request } from '@nestjs/common';
import { Public } from 'src/shared/decorators/public.decorator';
import { TextDto } from '../dto/text.dto';
import { AiAgentService } from '../services/ai-agent.service';

@Controller('ai-agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Public()
  @Post()
  create(@Body() { text, lang }: TextDto) {
    return this.aiAgentService.analyzeText(text, lang);
  }

  @Post('request-analysis/:lang')
  requestAnalysis(
    @Request() req: Request & { user: { sub: string } },
    @Param('lang') lang?: string,
  ) {
    const userId = req.user.sub;
    return this.aiAgentService.requestAnalysis({
      lang: lang ? lang : 'pt',
      userId,
    });
  }
}
