import { FetchParentTreeUseCase } from '@/domain/application/useCases/fetchParentTree'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { UserNotFoundError } from '@/domain/application/_errors/userNotFoundError'
import { ParentTreeDetailsPresenter } from '../presenters/parentTreeDetailsPresenter'
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@Controller(':parentId/tree')
export class FetchParentTreeController {
  constructor(private useCase: FetchParentTreeUseCase) {}
  @Get()
  @ApiTags('Users')
  @ApiOperation({ summary: 'Fetch Parent Tree' })
  @ApiCookieAuth('access_token')
  @ApiParam({ name: 'parentId', required: true, description: 'User Parent ID' })
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        parent: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'John Doe' },
            userName: { type: 'string', example: 'johnDoe' },
          },
        },
        subordinates: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string', example: 'John Doe' },
              userName: { type: 'string', example: 'johnDoe' },
              createdAt: { type: 'Date', example: '2024-07-26T10:44:15.121Z' },
              updatedAt: { type: 'Date', example: '2024-07-26T16:44:15.121Z' },
            },
          },
        },
      },
    },
  })
  @HttpCode(200)
  async handle(@Param('parentId') parentId: string) {
    try {
      const { parentTreeDetails } = await this.useCase.execute({
        parentId,
      })

      return {
        parentTreeDetails: ParentTreeDetailsPresenter.toHttp(parentTreeDetails),
      }
    } catch (error) {
      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
