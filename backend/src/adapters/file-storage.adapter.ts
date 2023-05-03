import { R2Bucket, File } from '@cloudflare/workers-types';

const BUCKET_NAME = 'VAR_FOO_BUCKET';

class FileStorageAdapter {
    env: any;

    private getR2Bucket(r2BucketName: string): R2Bucket {
        const bucket: R2Bucket = this.env[r2BucketName];
        if (!bucket) {
            throw new Error('Invalid R2 bucket name: ' + r2BucketName);
        }
        return bucket;
    }

    public registerEnv(env: any) {
        this.env = env;
    }

    public async saveFile(fileName: string, file: File) {
        const bucket = this.getR2Bucket(BUCKET_NAME);

        return bucket.put(fileName, file.stream(), {
            httpMetadata: {
                contentType: file.type
            },
            customMetadata: {
                createdAt: (new Date()).toString()
            }
        });
    }
}

export const fileStorage = new FileStorageAdapter();
