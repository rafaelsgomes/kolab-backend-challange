import { User, UserProps } from "@/domain/entities/User";
import {faker} from '@faker-js/faker'
import { randomUUID } from "crypto";

export function makeUser(override: Partial<UserProps> = {}, id?: string){
  const user = User.create({
    name: faker.person.fullName(),
    userName: faker.internet.userName(),
    password: faker.internet.password({
      length: 20
    }),
    parentUserId: randomUUID(),
    ...override
  }, id)

  return user
}