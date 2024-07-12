import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createAccount(@Body() body: any) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException('Email já existente')
    }
    const hashedPass = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass,
      },
    })
  }
}
