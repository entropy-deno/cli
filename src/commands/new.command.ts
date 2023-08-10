import { Command } from '../interfaces/command.interface.ts';
import {
  inject,
  Logger,
} from 'https://deno.land/x/entropy@1.0.0-alpha.8/src/mod.ts';
import { readAll } from 'https://deno.land/std@0.198.0/streams/mod.ts';
import { readerFromStreamReader } from 'https://deno.land/std@0.198.0/streams/mod.ts';
import { Untar } from 'https://deno.land/std@0.198.0/archive/untar.ts';

export class NewCommand implements Command {
  private readonly logger = inject(Logger);

  public async handle() {
    const repositoryName = 'app-template';
    const repositoryUrl = `https://github.com/entropy-deno/${repositoryName}`;
    const archiveUrl = `${repositoryUrl}/archive/refs/heads/main.tar.gz`;

    const name = prompt('Project name: ') ?? 'entropy-app';

    try {
      const res = await fetch(archiveUrl);

      const streamReader = res.body?.pipeThrough(new DecompressionStream('gzip'))
        .getReader();

      if (streamReader) {
        const denoReader = readerFromStreamReader(streamReader);
        const untar = new Untar(denoReader);

        await Deno.mkdir(`./${name}`, {
          recursive: true,
        });

        const archiveName = `${repositoryUrl}-main`;
        const ommitedFiles = ['.github', 'pax_global_header'];

        fileEntryLoop:
        for await (const entry of untar) {
          const { fileName, type } = entry;

          if (fileName === `${archiveName}/`) {
            continue;
          }

          for (const ommitedFile of ommitedFiles) {
            if (fileName.includes(ommitedFile)) {
              continue fileEntryLoop;
            }
          }

          if (type === 'directory') {
            await Deno.mkdir(fileName.replace(archiveName, name), {
              recursive: true,
            });

            continue;
          }

          const content = await readAll(entry);

          if (fileName.includes('.png')) {
            await Deno.writeFile(
              fileName.replace(archiveName, name),
              content,
            );

            continue;
          }

          const textContent = new TextDecoder('utf-8').decode(content);

          await Deno.writeTextFile(
            fileName.replace(archiveName, name),
            textContent,
          );
        }
      }
    } catch {
      this.logger.error('Connection failed');

      return 1;
    }
  }
}
