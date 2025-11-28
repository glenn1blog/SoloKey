import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type {
    TSongAsset,
    TSongAssetStatus,
    TSongSource,
} from "@solokey/shared";

export interface CreateSongAssetInput {
    source: TSongSource;
    filename: string;
    mimetype: string;
    sizeBytes: number;
    durationSec: number;
    sampleRate: number;
    checksum: string;
    storagePath: string;
}

export default class SongAssetRepository {
    private readonly dbPath: string;
    private readonly ready: Promise<void>;

    constructor(dbFile: string) {
        this.dbPath = resolve(dbFile);
        this.ready = this.ensureStore();
    }

    async create(input: CreateSongAssetInput): Promise<TSongAsset> {
        const now = new Date().toISOString();
        const record: TSongAsset = {
            id: randomUUID(),
            source: input.source,
            filename: input.filename,
            mimetype: input.mimetype,
            sizeBytes: input.sizeBytes,
            durationSec: input.durationSec,
            sampleRate: input.sampleRate,
            checksum: input.checksum,
            storagePath: input.storagePath,
            status: "pending-analysis",
            createdAt: now,
            updatedAt: now,
        };

        const records = await this.readAll();
        records.push(record);
        await this.writeAll(records);
        return record;
    }

    async updateStatus(
        id: string,
        status: TSongAssetStatus,
        error?: string
    ): Promise<TSongAsset | undefined> {
        const records = await this.readAll();
        const next = records.map((record) =>
            record.id === id
                ? {
                      ...record,
                      status,
                      error,
                      updatedAt: new Date().toISOString(),
                  }
                : record
        );
        await this.writeAll(next);
        return next.find((record) => record.id === id);
    }

    async findById(id: string): Promise<TSongAsset | undefined> {
        const records = await this.readAll();
        return records.find((record) => record.id === id);
    }

    async findByChecksum(checksum: string): Promise<TSongAsset | undefined> {
        const records = await this.readAll();
        return records.find((record) => record.checksum === checksum);
    }

    async list(): Promise<TSongAsset[]> {
        return this.readAll();
    }

    private async ensureStore(): Promise<void> {
        await mkdir(dirname(this.dbPath), { recursive: true });
        try {
            await readFile(this.dbPath, "utf-8");
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") {
                await writeFile(this.dbPath, "[]", "utf-8");
                return;
            }
            throw error;
        }
    }

    private async readAll(): Promise<TSongAsset[]> {
        await this.ready;
        const raw = await readFile(this.dbPath, "utf-8");
        return raw.trim() ? (JSON.parse(raw) as TSongAsset[]) : [];
    }

    private async writeAll(records: TSongAsset[]): Promise<void> {
        await writeFile(this.dbPath, JSON.stringify(records, null, 2), "utf-8");
    }
}
