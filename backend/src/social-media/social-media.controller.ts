

import { Controller, Get } from '@nestjs/common';

@Controller('social-media')
export class SocialMediaController {

  constructor() {}


  @Get()
  getSomeMediaConnected() {
    return true;
  }

}