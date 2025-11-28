import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type {
    TDeviceInfo,
    TLatencyProfile,
    TLatencyProfileInput,
    TPracticeSession,
    TPracticeSessionState,
} from "@solokey/shared";

export interface CreatePracticeSessionInput {
    songAssetId: string;
    referenceContourVersion?: string;
    offsetMs?: number;
    deviceInfo?: TDeviceInfo;
}

export default class PracticeSessionRepository {
    private readonly dbPath: string;
    private readonly ready: Promise<void>;

    constructor(dbFile: string) {
        this.dbPath = resolve(dbFile);
        this.ready = this.ensureStore();
    }

    async create(input: CreatePracticeSessionInput): Promise<TPracticeSession> {
        const now = new Date().toISOString();
        const record: TPracticeSession = {
            id: randomUUID(),
            songAssetId: input.songAssetId,
            referenceContourVersion: input.referenceContourVersion,
            createdAt: now,
            updatedAt: now,
            state: "preparing",
            offsetMs: input.offsetMs ?? 0,
            deviceInfo: input.deviceInfo,
            offsetSource: undefined,
            latencyProfile: undefined,
            framesPath: undefined,
            networkStatus: undefined,
        };

        const records = await this.readAll();
        records.push(record);
        await this.writeAll(records);
        return record;
    }

    async update(
        id: string,
        patch: Partial<TPracticeSession>
    ): Promise<TPracticeSession | undefined> {
        const records = await this.readAll();
        let updated: TPracticeSession | undefined;
        const next = records.map((session) => {
            if (session.id !== id) {
                return session;
            }
            updated = {
                ...session,
                ...patch,
                updatedAt: new Date().toISOString(),
            };
            return updated;
        });

        if (!updated) {
            return undefined;
        }

        await this.writeAll(next);
        return updated;
    }

    async attachLatency(
        id: string,
        payload: TLatencyProfileInput
    ): Promise<TPracticeSession | undefined> {
        const profile: TLatencyProfile = {
            ...payload,
            updatedAt: new Date().toISOString(),
        };
        return this.update(id, {
            latencyProfile: profile,
            offsetMs: payload.valueMs,
            offsetSource: payload.mode,
        });
    }

    async updateState(
        id: string,
        state: TPracticeSessionState
    ): Promise<TPracticeSession | undefined> {
        return this.update(id, { state });
    }

    async findById(id: string): Promise<TPracticeSession | undefined> {
        const records = await this.readAll();
        return records.find((session) => session.id === id);
    }

    async list(): Promise<TPracticeSession[]> {
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

    private async readAll(): Promise<TPracticeSession[]> {
        await this.ready;
        const raw = await readFile(this.dbPath, "utf-8");
        return raw.trim() ? (JSON.parse(raw) as TPracticeSession[]) : [];
    }

    private async writeAll(records: TPracticeSession[]): Promise<void> {
        await writeFile(this.dbPath, JSON.stringify(records, null, 2), "utf-8");
    }
}
