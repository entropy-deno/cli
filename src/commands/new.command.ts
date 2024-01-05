import { snakeCase } from 'https://deno.land/x/case@2.2.0/mod.ts';
import { Encrypter } from 'https://deno.land/x/entropy@1.0.0-beta.14/src/encrypter/encrypter.module.ts';
import { inject } from 'https://deno.land/x/entropy@1.0.0-beta.14/src/injector/injector.module.ts';
import { Logger } from 'https://deno.land/x/entropy@1.0.0-beta.14/src/logger/logger.module.ts';
import { readAll } from 'https://deno.land/std@0.211.0/streams/mod.ts';
import { readerFromStreamReader } from 'https://deno.land/std@0.211.0/streams/mod.ts';
import { Untar } from 'https://deno.land/std@0.211.0/archive/untar.ts';
import { Command } from '../decorators/command.decorator.ts';
import { CommandHandler } from '../interfaces/command_handler.interface.ts';

interface Args {
  _: (string | number)[];
  h?: boolean;
  help?: boolean;
  mongodb?: boolean;
  name?: string;
}

@Command({
  name: 'new',
  aliases: ['create', 'c', 'n'],
  args: {
    boolean: ['h', 'help', 'mongodb'],
    string: ['name'],
    default: {
      h: false,
      help: false,
      mongodb: false,
    },
  },
})
export class NewCommand implements CommandHandler {
  private readonly encrypter = inject(Encrypter);

  private readonly logger = inject(Logger);

  private displayHelp(): void {
    this.logger.info('Role: Create a new Entropy project\n');

    this.logger.info('Usage: %c$ %centropy new %c<name>', {
      colors: ['gray', 'green', 'gray'],
    });

    this.logger.info(
      'Options: %c--mongodb [set up MongoDB in project database migrations]',
      {
        colors: ['gray'],
      },
    );
  }

  public async handle(args: Args) {
    if (args.h || args.help) {
      this.displayHelp();

      return 0;
    }

    const repositoryName = 'skeleton';
    const repositoryUrl = `https://github.com/entropy-deno/${repositoryName}`;
    const archiveUrl = `${repositoryUrl}/archive/refs/heads/main.tar.gz`;

    const projectName = snakeCase(
      args._[1]?.toString() ?? args.name ?? prompt('Project name: ') ??
        'entropy_app',
    );

    this.logger.info(`Creating project ${projectName}...`);

    try {
      this.logger.info('Downloading files...');

      const res = await fetch(archiveUrl);

      const streamReader = res.body?.pipeThrough(
        new DecompressionStream('gzip'),
      )
        .getReader();

      if (streamReader) {
        const reader = readerFromStreamReader(streamReader);
        const untar = new Untar(reader);

        await Deno.mkdir(`./${projectName}`, {
          recursive: true,
        });

        const archiveName = `${repositoryName}-main`;
        const ommitedFiles = ['.github', 'pax_global_header'];

        fileEntryLoop:
        for await (const entry of untar) {
          const { fileName, type } = entry;
          const filePath = fileName.replace(archiveName, projectName);

          if (fileName === `${archiveName}/`) {
            continue;
          }

          for (const ommitedFile of ommitedFiles) {
            if (fileName.includes(ommitedFile)) {
              continue fileEntryLoop;
            }
          }

          if (type === 'directory') {
            await Deno.mkdir(filePath, {
              recursive: true,
            });

            continue;
          }

          const content = await readAll(entry);

          if (fileName.includes('.png')) {
            await Deno.writeFile(filePath, content);

            continue;
          }

          const textContent = new TextDecoder('utf-8').decode(content);

          await Deno.writeTextFile(filePath, textContent);
        }

        this.logger.info('Preparing environment...');

        const envFile = `./${projectName}/.env`;

        await Deno.copyFile(
          `${envFile}.example`,
          envFile,
        );

        await Deno.writeTextFile(
          envFile,
          (await Deno.readTextFile(envFile)).replace(
            /^ENCRYPTER_KEY=.*?$/m,
            `ENCRYPTER_KEY=${this.encrypter.generateRandomString(32)}}`,
          ),
        );

        if (args.mongodb) {
          const schemaFile = `./${projectName}/database/schema.prisma`;

          await Deno.writeTextFile(
            schemaFile,
            (await Deno.readTextFile(schemaFile))
              .replace(
                'Int      @id @default(autoincrement())',
                'String   @id @default(auto()) @map("_id") @db.ObjectId',
              )
              .replace('mysql', 'mongodb'),
          );

          await Deno.writeTextFile(
            envFile,
            (await Deno.readTextFile(envFile)).replace(
              /^DATABASE_URL=.*?$/m,
              `DATABASE_URL=mongodb://root:@localhost/${projectName}`,
            ),
          );

          await Deno.writeTextFile(
            `${envFile}.example`,
            (await Deno.readTextFile(`${envFile}.example`)).replace(
              /^DATABASE_URL=.*?$/m,
              `DATABASE_URL=mongodb://root:@localhost/${projectName}`,
            ),
          );
        }
      }

      this.logger.info(`Project ${projectName} created successfully!`);
    } catch {
      this.logger.error('Connection failed');

      return 1;
    }
  }
}
