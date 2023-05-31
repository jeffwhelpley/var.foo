
class Config {
    allowOrigin = '';
    fileRoot = '';

    public registerEnv(env: any) {
        this.allowOrigin = env.ALLOW_ORIGIN;
        this.fileRoot = env.FILE_ROOT;
    }
}

export const config = new Config();
