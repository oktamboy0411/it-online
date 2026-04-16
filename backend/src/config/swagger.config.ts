import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HelloModule, UserModule } from '../modules';

type ModuleSwaggerConfig = {
  module: Function;
  name: string;
  path: string;
};

const moduleSwaggerConfigs: ModuleSwaggerConfig[] = [
  {
    module: HelloModule,
    name: 'Hello Module API',
    path: 'docs/hello',
  },
  {
    module: UserModule,
    name: 'User Module API',
    path: 'docs/users',
  },
];

export function setupSwagger(app: INestApplication): void {
  const baseConfig = new DocumentBuilder()
    .setTitle('LINKO Backend API')
    .setDescription('General API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const fullDocument = SwaggerModule.createDocument(app, baseConfig);
  SwaggerModule.setup('docs', app, fullDocument);

  for (const config of moduleSwaggerConfigs) {
    const moduleDoc = SwaggerModule.createDocument(app, baseConfig, {
      include: [config.module],
    });

    SwaggerModule.setup(config.path, app, moduleDoc, {
      customSiteTitle: config.name,
    });
  }
}
