import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";

jest.setTimeout(30000); // tăng timeout cả file lên 30s

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let baseUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    // listen trên cổng 0 để OS tự pick cổng trống -> tránh conflict
    await app.listen(0);
    baseUrl = await app.getUrl(); // ví dụ: http://127.0.0.1:xxxxx

    // cấu hình pactum dùng base url này
    pactum.request.setBaseUrl(baseUrl);

    // lấy prisma service và clean db (giữ nguyên method cleanDb giả sử bạn đã có)
    prisma = app.get(PrismaService);
    if (prisma && typeof prisma.cleanDb === 'function') {
      await prisma.cleanDb();
    } else {
      // nếu bạn không có cleanDb, có thể implement truncate ở đây hoặc throw thông báo:
      // throw new Error('PrismaService.cleanDb() not found. Implement DB cleaning for tests.');
    }
  }, 30000); // timeout cho beforeAll riêng nếu cần

  afterAll(async () => {
    // đóng app và disconnect prisma
    if (prisma && typeof prisma.$disconnect === 'function') {
      await prisma.$disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  it.todo('should pass');
});
