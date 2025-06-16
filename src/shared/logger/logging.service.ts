import { LoggerService, Injectable, ConsoleLogger } from '@nestjs/common';
import { join } from 'path';
import {
  access,
  appendFile,
  constants,
  writeFile,
  rename,
  stat,
  mkdir,
} from 'node:fs/promises';
import {
  BYTES_IN_KB,
  LOG_LEVELS,
  LogLevel,
  LogLevelsEnum,
  LOGS_FOLDER_FILE_NAME,
  LOGS_FOLDER_NAME,
} from 'src/constants';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logFilePath = join(
    process.cwd(),
    LOGS_FOLDER_NAME,
    LOGS_FOLDER_FILE_NAME,
  );
  private readonly logLevel: string;
  private readonly maxFileSize: number;
  private readonly consoleLogger: ConsoleLogger = new ConsoleLogger();
  private isRotating = false;

  constructor() {
    this.logLevel = process.env.LOG_LEVEL || LogLevelsEnum.WARN;
    this.maxFileSize = parseInt(process.env.LOG_FILE_ROTATION || '100');
    this.createLogFolder();
  }

  private shouldLog(level: LogLevelsEnum): boolean {
    return (
      LOG_LEVELS.indexOf(level) >=
      LOG_LEVELS.indexOf(this.logLevel as LogLevelsEnum)
    );
  }

  private async rotateFile() {
    if (this.isRotating) return;

    try {
      this.isRotating = true;
      const statInfo = await stat(this.logFilePath);

      if (statInfo.size / BYTES_IN_KB > this.maxFileSize) {
        const rotatedName = this.logFilePath.replace(
          '.log',
          `-${Date.now()}.log`,
        );

        await rename(this.logFilePath, rotatedName);
        await writeFile(this.logFilePath, '');
      }
    } catch (error) {
      throw new Error(error.message);
    } finally {
      this.isRotating = false;
    }
  }

  private async checkIsExist(path: string) {
    try {
      await access(path, constants.F_OK);
      return true;
    } catch (error) {
      if (error && error.code === 'ENOENT') {
        return false;
      }

      throw new Error((error as Error).message);
    }
  }

  private async createLogFolder() {
    const folderName = join(process.cwd(), LOGS_FOLDER_NAME);

    const isFolderExist = await this.checkIsExist(folderName);
    const isFileExist = await this.checkIsExist(this.logFilePath);

    if (!isFolderExist) {
      try {
        await mkdir(folderName, { recursive: true });
      } catch (error) {
        throw new Error(error.message);
      }
    }

    if (!isFileExist) {
      try {
        await writeFile(this.logFilePath, '');
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  async writeFile(
    logLevel: LogLevel,
    message: any,
    context?: string,
    trace?: string,
  ) {
    const time = new Date().toISOString();
    const logMessage = `[${time}] [${logLevel.toLocaleUpperCase()}] ${context ? `[${context}]` : ''} ${message} ${trace ? `\nTRACE: ${trace}` : ''}\n`;
    try {
      await appendFile(this.logFilePath, logMessage, 'utf-8');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async log(message: string, context: string) {
    if (this.shouldLog(LogLevelsEnum.LOG)) {
      await this.rotateFile();
      await this.writeFile(LogLevelsEnum.LOG, message, context);
      this.consoleLogger.log(message, context);
    }
  }

  async warn(message: string, context: string) {
    if (this.shouldLog(LogLevelsEnum.WARN)) {
      await this.rotateFile();
      await this.writeFile(LogLevelsEnum.WARN, message, context);
      this.consoleLogger.warn(message, context);
    }
  }

  async error(message: string, trace?: string, context?: string) {
    if (this.shouldLog(LogLevelsEnum.ERROR)) {
      await this.rotateFile();
      await this.writeFile(LogLevelsEnum.ERROR, message, context, trace);
      this.consoleLogger.error(message, trace, context);
    }
  }

  async verbose(message: string, context: string) {
    if (this.shouldLog(LogLevelsEnum.VERBOSE)) {
      await this.rotateFile();
      await this.writeFile(LogLevelsEnum.VERBOSE, message, context);
      this.consoleLogger.verbose(message, context);
    }
  }

  async debug(message: string, context: string) {
    if (this.shouldLog(LogLevelsEnum.DEBUG)) {
      await this.rotateFile();
      await this.writeFile(LogLevelsEnum.DEBUG, message, context);
      this.consoleLogger.debug(message, context);
    }
  }

  async fatal(message: string, context: string) {
    if (this.shouldLog(LogLevelsEnum.FATAL)) {
      await this.rotateFile();
      await this.writeFile(LogLevelsEnum.FATAL, message, context);
      this.consoleLogger.fatal(message, context);
    }
  }
}
