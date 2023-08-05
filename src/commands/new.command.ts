import { Command } from '../interfaces/command.interface.ts';
import {
  inject,
  Logger,
} from 'https://deno.land/x/entropy@1.0.0-alpha.5/src/mod.ts';
import { readAll } from 'https://deno.land/std@0.197.0/streams/mod.ts';
import { readerFromStreamReader } from 'https://deno.land/std@0.197.0/streams/mod.ts';
import { Untar } from 'https://deno.land/std@0.197.0/archive/untar.ts';

export class NewCommand implements Command {
  private readonly logger = inject(Logger);

  public async handle() {
    const repoName = 'app-template';
    const repoUrl = `https://github.com/entropy-deno/${repoName}`;
    const archiveUrl = `${repoUrl}/archive/refs/heads/main.tar.gz`;

    const name = prompt('Project name: ') ?? 'entropy-app';

    try {
      const res = await fetch(archiveUrl);

      const streamReader = res.body?.pipeThrough(new DecompressionStream('gzip'))
        ?.getReader();

      if (streamReader) {
        const denoReader = readerFromStreamReader(streamReader);
        const untar = new Untar(denoReader);

        await Deno.mkdir(`./${name}`, {
          recursive: true,
        });

        const ommitedFiles = ['.github', 'pax_global_header'];

        fileEntryLoop:
        for await (const entry of untar) {
          const { fileName, type } = entry;

          if (fileName === 'app-template-main/') {
            continue;
          }

          for (const ommitedFile of ommitedFiles) {
            if (fileName.includes(ommitedFile)) {
              continue fileEntryLoop;
            }
          }

          if (type === 'directory') {
            await Deno.mkdir(fileName.replace('app-template-main', name), {
              recursive: true,
            });

            continue;
          }

          const content = await readAll(entry);

          if (fileName.includes('.png')) {
            await Deno.writeFile(
              fileName.replace('app-template-main', name),
              content,
            );

            continue;
          }

          const textContent = new TextDecoder('utf-8').decode(content);

          await Deno.writeTextFile(
            fileName.replace('app-template-main', name),
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
