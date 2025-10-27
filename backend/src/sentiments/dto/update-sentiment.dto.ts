import { PartialType } from '@nestjs/mapped-types';
import { CreateSentimentDto } from './create-sentiment.dto';

export class UpdateSentimentDto extends PartialType(CreateSentimentDto) {}
