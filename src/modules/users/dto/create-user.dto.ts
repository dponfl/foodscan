export class CreateUserDto {
  clientId: number;
  userName: string;
  userNick?: string;
  lang: string;
  balance?: number;
}
