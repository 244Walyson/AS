import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { S3Service } from 'src/s3/s3.service';
import { SocialComment } from 'src/social-media/entities/social-comment.entity';
import { SocialPost } from 'src/social-media/entities/social-post.entity';
import { SocialToken } from 'src/social-media/entities/social-token.entity';
import { Readable } from 'stream';
import { Repository } from 'typeorm';

@Injectable()
export class InstagramService {
  private readonly instagramGraphUrl: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(SocialPost)
    private readonly postRepository: Repository<SocialPost>,
    @InjectRepository(SocialToken)
    private readonly tokenRepository: Repository<SocialToken>,
    @InjectRepository(SocialComment)
    private readonly commentRepository: Repository<SocialComment>,
    private readonly httpService: HttpService,
    private readonly s3Service: S3Service,
  ) {
    this.instagramGraphUrl = this.configService.get<string>(
      'INSTAGRAM_GRAPH_URL',
    );
  }

  async syncPosts(userId: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { userId: userId, provider: 'instagram' },
    });
    if (!token) {
      throw new BadRequestException('Instagram credentials not found for user');
    }
    const url = `${this.instagramGraphUrl}/${token.userSocialId}/media`;
    const fields = 'id,caption,media_type,media_url,permalink,timestamp';

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { fields, access_token: token.accessToken },
        }),
      );

      const posts = response.data.data;
      console.log(`📸 ${posts.length} posts obtidos do Instagram.`);

      for (const p of posts) {

        const file = await this.getContentFilePost(p.media_url, p.id)
        const s3MediaUrl = await this.s3Service.uploadFile(file)

        const post = this.postRepository.create({
          id: p.id,
          platform: 'instagram',
          caption: p.caption,
          mediaType: p.media_type,
          mediaUrl: p.media_url,
          permalink: p.permalink,
          timestamp: new Date(p.timestamp),
          s3MediaUrl: s3MediaUrl,
        });

        await this.postRepository.save(post);
      }

      console.log('✅ Posts sincronizados com sucesso.');
    } catch (error) {
      console.error(
        '❌ Erro ao sincronizar posts do Instagram:',
        error.message,
      );
    }
  }

  private async getContentFilePost(url: string, postId: string) {
    const response = await firstValueFrom(this.httpService.get(url, { responseType: 'arraybuffer' }));

    const file: Express.Multer.File = {
      fieldname: 'file',
      originalname: `${postId}.jpg`,
      encoding: '7bit',
      mimetype: response.headers['content-type'] || 'image/jpeg',
      size: response.data.byteLength,
      buffer: Buffer.from(response.data),
      destination: '',
      filename: '',
      path: '',
      stream: Readable.from(response.data),
    };
    return file;
  }

  async syncComments(postId: string, userId: string): Promise<void> {
    const token = await this.tokenRepository.findOne({
      where: { userId: userId, provider: 'instagram' },
    });
    if (!token) {
      throw new BadRequestException('Instagram credentials not found for user');
    }
    const url = `${this.instagramGraphUrl}/${postId}/comments`;
    const fields = 'id,username,text,timestamp,like_count';

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          params: { fields, access_token: token.accessToken },
        }),
      );

      const comments = response.data.data;
      console.log(
        `💬 ${comments.length} comentários obtidos para post ${postId}.`,
      );

      for (const c of comments) {
        const comment = this.commentRepository.create({
          id: c.id,
          postId: postId,
          username: c.username,
          text: c.text,
          timestamp: new Date(c.timestamp),
          likeCount: c.like_count ?? 0,
        });

        await this.commentRepository.save(comment);
      }

      console.log(
        `✅ Comentários do post ${postId} sincronizados com sucesso.`,
      );
    } catch (error) {
      console.error(
        `❌ Erro ao sincronizar comentários do post ${postId}:`,
        error,
      );
    }
  }
}
